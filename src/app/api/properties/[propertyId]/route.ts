import dynamodb from "@/app/lib/dynamodb";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import { PutObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_ACCESS_SECRET as string,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;
const BUCKET_NAME_ATTACHMENTS = "mavenattachments";

// Function for uploading images to S3
async function uploadFilesToS3(files: File[], folderName: string) {
  const fileUrls = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${folderName}/${file.name}`;
      const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
      };
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return `https://mavenpropertyimages.s3.amazonaws.com/${filename}`;
    })
  );
  return fileUrls;
}

// Function for uploading PDFs to S3
async function uploadPdfsToS3(files: File[], folderName: string) {
  const fileUrls = await Promise.all(
    files.map(async (file) => {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${folderName}/${file.name}`;
        const params = {
          Bucket: BUCKET_NAME_ATTACHMENTS,
          Key: filename,
          Body: buffer,
          ContentType: 'application/pdf',
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return `https://mavenattachments.s3.amazonaws.com/${filename}`;
      } catch (error) {
        console.error(`Failed to upload PDF: ${file.name}`, error);
        throw error;
      }
    })
  );
  return fileUrls;
}

// Function to delete files from S3
async function deleteFileFromS3(bucket: string, key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3Client.send(command);
    console.log(`Deleted file: ${key} from bucket: ${bucket}`);
  } catch (error) {
    console.error(`Failed to delete file: ${key}`, error);
    throw error;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    if (!params.propertyId) {
      return NextResponse.json({ error: "Property ID is required" });
    }

    // Retrieve property details from DynamoDB based on ID
    const parameter = {
      TableName: "properties",
      Key: {
        id: params.propertyId.toString(),
      },
    };

    const data = await dynamodb.get(parameter).promise();

    // Check if property exists
    if (!data.Item) {
      return NextResponse.json({ error: "Property not found" });
    }

    // Extract property details from the response data
    const property = data.Item;

    // Handle image URLs
    if (property.imageUrl) {
      const fullImageUrl = property.imageUrl;
      const imageFolder = new URL(fullImageUrl).pathname.substring(1);

      const imageKeys = await listObjectsInFolder(imageFolder);

      if (imageKeys.length === 0) {
        console.warn("No images found in folder:", imageFolder);
      }

      const imageUrls = imageKeys.map((key) => {
        return encodeURI("https://d2cw6pmn7dqyjd.cloudfront.net/" + key);
      });

      property.imageUrls = imageUrls;
    } else {
      property.imageUrls = [];
    }

    // Return the property details
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error retrieving property:", error);
    NextResponse.json({ error: "Failed to retrieve property" });
  }
}

async function listObjectsInFolder(folder: string): Promise<string[]> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Prefix: folder,
  };

  const response = await s3.listObjectsV2(params).promise();

  // Filter out directory-like entries
  return response.Contents
    ? response.Contents.map((item) => item.Key!).filter((key) => !key.endsWith('/'))
    : [];
}

export async function PATCH(
  req: Request,
  { params }: { params: { propertyId: string } }
) {
  const { propertyId } = params;
  console.log(`--- PATCH Request Started for propertyId: ${propertyId} ---`);

  try {
    const contentType = req.headers.get('content-type') || '';
    console.log(`Content-Type: ${contentType}`);

    if (contentType.includes('multipart/form-data')) {
      console.log("Handling file update...");
      return await handleFileUpdate(req, propertyId);
    } else {
      console.log("Handling JSON-only update...");
      return await handleJsonUpdate(req, propertyId);
    }
  } catch (error: any) { // Type 'any' for better error logging
    console.error("Error updating property (main PATCH handler):", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to update property", details: error.message },
      { status: 500 }
    );
  } finally {
    console.log(`--- PATCH Request Finished for propertyId: ${propertyId} ---`);
  }
}

async function handleFileUpdate(req: Request, propertyId: string) {
  console.log(`handleFileUpdate: Processing for propertyId: ${propertyId}`);
  try {
    const formData = await req.formData();
    console.log("handleFileUpdate: FormData parsed.");

    const existingProperty = await dynamodb.get({
      TableName: "properties",
      Key: { id: propertyId }
    }).promise();

    if (!existingProperty.Item) {
      console.warn(`handleFileUpdate: Property with ID ${propertyId} not found.`);
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const property = existingProperty.Item;
    const existingImageUrl = property.imageUrl;
    let folderName = '';
    
    if (existingImageUrl) {
      const urlParts = existingImageUrl.split('/');
      folderName = urlParts[urlParts.length - 2];
      console.log(`handleFileUpdate: Extracted folder name from existingImageUrl: ${folderName}`);
    } else {
      const address = property.address;
      folderName = `${address.street}_${address.city}_${address.state}_${address.zipCode}`.replace(/ /g, "_");
      console.log(`handleFileUpdate: Generated folder name from address (no existing imageUrl): ${folderName}`);
    }

    const fileList = formData.getAll("files");
    const files = fileList.filter((item): item is File => item instanceof File);
    console.log(`handleFileUpdate: Found ${files.length} new image files.`);

    const pdfFileList = formData.getAll("pdfs");
    const pdfFiles = pdfFileList.filter((item): item is File => item instanceof File);
    console.log(`handleFileUpdate: Found ${pdfFiles.length} new PDF files.`);

    const imagesToDelete = formData.get("imagesToDelete")?.toString().split(',').filter(Boolean) || [];
    const pdfsToDelete = formData.get("pdfsToDelete")?.toString().split(',').filter(Boolean) || [];
    console.log(`handleFileUpdate: Images to delete: ${imagesToDelete.length}, PDFs to delete: ${pdfsToDelete.length}`);

    for (const imageUrl of imagesToDelete) {
      let key = '';
      if (imageUrl.includes('mavenpropertyimages.s3.amazonaws.com')) {
        key = imageUrl.replace('https://mavenpropertyimages.s3.amazonaws.com/', '');
      } else if (imageUrl.includes('d2cw6pmn7dqyjd.cloudfront.net')) {
        key = imageUrl.replace('https://d2cw6pmn7dqyjd.cloudfront.net/', '');
      }
      if (key) {
        console.log(`handleFileUpdate: Deleting image from S3: ${key}`);
        await deleteFileFromS3(BUCKET_NAME, key);
      }
    }

    for (const pdfUrl of pdfsToDelete) {
      const key = pdfUrl.replace('https://mavenattachments.s3.amazonaws.com/', '');
      console.log(`handleFileUpdate: Deleting PDF from S3: ${key}`);
      await deleteFileFromS3(BUCKET_NAME_ATTACHMENTS, key);
    }

    let newImageUrls: string[] = [];
    let newPdfUrls: string[] = [];

    if (files.length > 0) {
      console.log("handleFileUpdate: Uploading new image files...");
      newImageUrls = await uploadFilesToS3(files, folderName);
      console.log(`handleFileUpdate: Uploaded ${newImageUrls.length} new image files.`);
    }

    if (pdfFiles.length > 0) {
      console.log("handleFileUpdate: Uploading new PDF files...");
      newPdfUrls = await uploadPdfsToS3(pdfFiles, folderName);
      console.log(`handleFileUpdate: Uploaded ${newPdfUrls.length} new PDF files.`);
    }

    const existingImageUrls = property.imageUrls || [];
    const existingPdfUrls = property.pdfUrls || [];

    const finalImageUrls = [
      ...existingImageUrls.filter((url: string) => !imagesToDelete.includes(url)),
      ...newImageUrls
    ];
    const finalPdfUrls = [
      ...existingPdfUrls.filter((url: string) => !pdfsToDelete.includes(url)),
      ...newPdfUrls
    ];
    console.log(`handleFileUpdate: Final image URLs count: ${finalImageUrls.length}`);
    console.log(`handleFileUpdate: Final PDF URLs count: ${finalPdfUrls.length}`);

    // Extract other form data (add console.logs for these if desired)
    const offer = formData.get("offer")?.toString();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const askingPrice = formData.get("askingPrice")?.toString();
    const pricePerSF = formData.get("pricePerSF")?.toString();
    const propertyType = formData.get("propertyType")?.toString();
    const buildingSize = formData.get("buildingSize")?.toString();
    const landSize = formData.get("landSize")?.toString();
    const yearBuilt = formData.get("yearBuilt")?.toString();
    const frontage = formData.get("frontage")?.toString();
    const parking = formData.get("parking")?.toString();
    const leaseAmount = formData.get("leaseAmount")?.toString();
    const escrow = formData.get("escrow")?.toString();
    const street = formData.get("street")?.toString();
    const city = formData.get("city")?.toString();
    const state = formData.get("state")?.toString();
    const zipCode = formData.get("zipCode")?.toString();


    console.log("handleFileUpdate: Preparing DynamoDB update parameters...");
    const dbParams = {
      TableName: "properties",
      Key: { id: propertyId },
      UpdateExpression: `set 
        #offer = :offer,
        #name = :name,
        #description = :description,
        #askingPrice = :askingPrice,
        #pricePerSF = :pricePerSF,
        #propertyType = :propertyType,
        #buildingSize = :buildingSize,
        #landSize = :landSize,
        #yearBuilt = :yearBuilt,
        #frontage = :frontage,
        #parking = :parking,
        #leaseAmount = :leaseAmount,
        #address = :address,
        #escrow = :escrow,
        #imageUrls = :imageUrls,
        #pdfUrls = :pdfUrls`,
      ExpressionAttributeNames: {
        "#offer": "offer",
        "#name": "name",
        "#description": "description",
        "#askingPrice": "askingPrice",
        "#pricePerSF": "pricePerSF",
        "#propertyType": "propertyType",
        "#buildingSize": "buildingSize",
        "#landSize": "landSize",
        "#yearBuilt": "yearBuilt",
        "#frontage": "frontage",
        "#parking": "parking",
        "#leaseAmount": "leaseAmount",
        "#address": "address",
        "#escrow": "escrow",
        "#imageUrls": "imageUrls",
        "#pdfUrls": "pdfUrls",
      },
      ExpressionAttributeValues: {
        ":offer": offer,
        ":name": name,
        ":description": description,
        ":askingPrice": askingPrice,
        ":pricePerSF": pricePerSF,
        ":propertyType": propertyType,
        ":buildingSize": buildingSize,
        ":landSize": landSize,
        ":yearBuilt": yearBuilt,
        ":frontage": frontage,
        ":parking": parking,
        ":leaseAmount": leaseAmount,
        ":address": { street, city, state, zipCode },
        ":escrow": escrow,
        ":imageUrls": finalImageUrls,
        ":pdfUrls": finalPdfUrls,
      },
    };

    console.log("handleFileUpdate: Attempting to update item in DynamoDB...");
    await dynamodb.update(dbParams).promise();
    console.log("handleFileUpdate: Item successfully updated in DynamoDB.");

    // Forced revalidation for home and all listings pages
    try {
      const targetRevalidateUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      console.log(`handleFileUpdate: Revalidation initiated. Target URL: ${targetRevalidateUrl}/api/revalidate`);

      console.log("handleFileUpdate: Revalidating home page (path: /)...");
      const homeRevalidateRes = await fetch(`${targetRevalidateUrl}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" })
      });
      const homeRevalidateData = await homeRevalidateRes.json();
      console.log("handleFileUpdate: Home page revalidation response:", homeRevalidateData);

      console.log("handleFileUpdate: Fetching total properties for paginated listings revalidation...");
      const data = await dynamodb.scan({ TableName: "properties" }).promise();
      const totalProperties = data.Items ? data.Items.length : 0;
      const ITEMS_PER_PAGE = 9;
      const totalPages = Math.max(1, Math.ceil(totalProperties / ITEMS_PER_PAGE));
      console.log(`handleFileUpdate: Total properties: ${totalProperties}, Total pages to revalidate: ${totalPages}`);

      for (let i = 1; i <= totalPages; i++) {
        const pagePath = `/properties/page/${i}`;
        console.log(`handleFileUpdate: Revalidating page ${i} (path: ${pagePath})...`);
        const pageRevalidateRes = await fetch(`${targetRevalidateUrl}/api/revalidate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pagePath })
        });
        const pageRevalidateData = await pageRevalidateRes.json();
        console.log(`handleFileUpdate: Page ${i} revalidation response:`, pageRevalidateData);
      }
      console.log("handleFileUpdate: All revalidation requests sent.");
    } catch (e: any) {
      console.error("handleFileUpdate: Revalidation error (during fetch to /api/revalidate):", e.message, e.stack);
    }

    console.log("handleFileUpdate: Property updated successfully with files. Returning response.");
    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
      imageUrls: finalImageUrls,
      pdfUrls: finalPdfUrls,
    });
  } catch (error: any) {
    console.error("Error updating property with files (handleFileUpdate):", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

async function handleJsonUpdate(req: Request, propertyId: string) {
  console.log(`handleJsonUpdate: Processing for propertyId: ${propertyId}`);
  try {
    const jsonBody = await req.json();
    console.log("handleJsonUpdate: JSON data parsed.");

    const {
      offer, name, description, askingPrice, pricePerSF, propertyType, buildingSize,
      landSize, yearBuilt, frontage, parking, leaseAmount, address, escrow,
    } = jsonBody;

    if (!propertyId) {
      console.warn("handleJsonUpdate: Property ID is required for JSON update.");
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    console.log("handleJsonUpdate: Preparing DynamoDB update parameters...");
    const dbParams = {
      TableName: "properties",
      Key: { id: propertyId },
      UpdateExpression: `set 
        #offer = :offer,
        #name = :name,
        #description = :description,
        #askingPrice = :askingPrice,
        #pricePerSF = :pricePerSF,
        #propertyType = :propertyType,
        #buildingSize = :buildingSize,
        #landSize = :landSize,
        #yearBuilt = :yearBuilt,
        #frontage = :frontage,
        #parking = :parking,
        #leaseAmount = :leaseAmount,
        #address = :address,
        #escrow = :escrow`,
      ExpressionAttributeNames: {
        "#offer": "offer",
        "#name": "name",
        "#description": "description",
        "#askingPrice": "askingPrice",
        "#pricePerSF": "pricePerSF",
        "#propertyType": "propertyType",
        "#buildingSize": "buildingSize",
        "#landSize": "landSize",
        "#yearBuilt": "yearBuilt",
        "#frontage": "frontage",
        "#parking": "parking",
        "#leaseAmount": "leaseAmount",
        "#address": "address",
        "#escrow": "escrow",
      },
      ExpressionAttributeValues: {
        ":offer": offer,
        ":name": name,
        ":description": description,
        ":askingPrice": askingPrice,
        ":pricePerSF": pricePerSF,
        ":propertyType": propertyType,
        ":buildingSize": buildingSize,
        ":landSize": landSize,
        ":yearBuilt": yearBuilt,
        ":frontage": frontage,
        ":parking": parking,
        ":leaseAmount": leaseAmount,
        ":address": address,
        ":escrow": escrow,
      },
    };

    console.log("handleJsonUpdate: Attempting to update item in DynamoDB...");
    await dynamodb.update(dbParams).promise();
    console.log("handleJsonUpdate: Item successfully updated in DynamoDB.");

    try {
      const targetRevalidateUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      console.log(`handleJsonUpdate: Revalidation initiated. Target URL: ${targetRevalidateUrl}/api/revalidate`);

      console.log("handleJsonUpdate: Revalidating home page (path: /)...");
      const homeRevalidateRes = await fetch(`${targetRevalidateUrl}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" })
      });
      const homeRevalidateData = await homeRevalidateRes.json();
      console.log("handleJsonUpdate: Home page revalidation response:", homeRevalidateData);

      console.log("handleJsonUpdate: Fetching total properties for paginated listings revalidation...");
      const data = await dynamodb.scan({ TableName: "properties" }).promise();
      const totalProperties = data.Items ? data.Items.length : 0;
      const ITEMS_PER_PAGE = 9;
      const totalPages = Math.max(1, Math.ceil(totalProperties / ITEMS_PER_PAGE));
      console.log(`handleJsonUpdate: Total properties: ${totalProperties}, Total pages to revalidate: ${totalPages}`);

      for (let i = 1; i <= totalPages; i++) { // FIX: Loop condition should be i <= totalPages
        const pagePath = `/properties/page/${i}`;
        

        console.log(`handleJsonUpdate: Revalidating page ${i} (path: ${pagePath})...`);
        const pageRevalidateRes = await fetch(`${targetRevalidateUrl}/api/revalidate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pagePath })
        });
        const pageRevalidateData = await pageRevalidateRes.json();
        console.log(`handleJsonUpdate: Page ${i} revalidation response:`, pageRevalidateData);
      }
      console.log("handleJsonUpdate: All revalidation requests sent.");
    } catch (e: any) {
      console.error("handleJsonUpdate: Revalidation error (during fetch to /api/revalidate):", e.message, e.stack);
    }

    console.log("handleJsonUpdate: Property updated successfully via JSON. Returning response.");
    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating property (handleJsonUpdate):", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}