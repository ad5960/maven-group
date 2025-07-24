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

  try {
    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file uploads
      return await handleFileUpdate(req, propertyId);
    } else {
      // Handle JSON-only updates (existing functionality)
      return await handleJsonUpdate(req, propertyId);
    }
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

async function handleFileUpdate(req: Request, propertyId: string) {
  try {
    const formData = await req.formData();
    
    // Get existing property to determine folder name
    const existingProperty = await dynamodb.get({
      TableName: "properties",
      Key: { id: propertyId }
    }).promise();

    if (!existingProperty.Item) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const property = existingProperty.Item;
    
    // Extract the existing folder name from the imageUrl
    const existingImageUrl = property.imageUrl;
    let folderName = '';
    
    if (existingImageUrl) {
      // Extract folder name from the existing imageUrl
      // imageUrl format: https://mavenpropertyimages.s3.amazonaws.com/folder_name/
      const urlParts = existingImageUrl.split('/');
      folderName = urlParts[urlParts.length - 2]; // Get the folder name before the trailing slash
    } else {
      // Fallback to creating folder name from address if no existing imageUrl
      const address = property.address;
      folderName = `${address.street}_${address.city}_${address.state}_${address.zipCode}`.replace(/ /g, "_");
    }

    // Handle new file uploads
    const fileList = formData.getAll("files");
    const files = fileList.filter((item): item is File => item instanceof File);

    const pdfFileList = formData.getAll("pdfs");
    const pdfFiles = pdfFileList.filter((item): item is File => item instanceof File);

    // Handle file deletions
    const imagesToDelete = formData.get("imagesToDelete")?.toString().split(',').filter(Boolean) || [];
    const pdfsToDelete = formData.get("pdfsToDelete")?.toString().split(',').filter(Boolean) || [];

    // Delete specified files
    for (const imageUrl of imagesToDelete) {
      // Handle both direct S3 URLs and CloudFront URLs
      let key = '';
      if (imageUrl.includes('mavenpropertyimages.s3.amazonaws.com')) {
        key = imageUrl.replace('https://mavenpropertyimages.s3.amazonaws.com/', '');
      } else if (imageUrl.includes('d2cw6pmn7dqyjd.cloudfront.net')) {
        key = imageUrl.replace('https://d2cw6pmn7dqyjd.cloudfront.net/', '');
      }
      if (key) {
        await deleteFileFromS3(BUCKET_NAME, key);
      }
    }

    for (const pdfUrl of pdfsToDelete) {
      const key = pdfUrl.replace('https://mavenattachments.s3.amazonaws.com/', '');
      await deleteFileFromS3(BUCKET_NAME_ATTACHMENTS, key);
    }

    // Upload new files
    let newImageUrls: string[] = [];
    let newPdfUrls: string[] = [];

    if (files.length > 0) {
      newImageUrls = await uploadFilesToS3(files, folderName);
    }

    if (pdfFiles.length > 0) {
      newPdfUrls = await uploadPdfsToS3(pdfFiles, folderName);
    }

    // Get existing URLs and combine with new ones
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

    // Extract other form data
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

    // Update DynamoDB
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

    await dynamodb.update(dbParams).promise();

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" })
      });
      // Revalidate all paginated listing pages
      const data = await dynamodb.scan({ TableName: "properties" }).promise();
      const totalProperties = data.Items ? data.Items.length : 0;
      const ITEMS_PER_PAGE = 9;
      const totalPages = Math.max(1, Math.ceil(totalProperties / ITEMS_PER_PAGE));
      for (let i = 1; i <= totalPages; i++) {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/revalidate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: `/properties/page/${i}` })
        });
      }
    } catch (e) {
      // Ignore revalidation errors
      console.error("Revalidation error:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
      imageUrls: finalImageUrls,
      pdfUrls: finalPdfUrls,
    });
  } catch (error) {
    console.error("Error updating property with files:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

async function handleJsonUpdate(req: Request, propertyId: string) {
  try {
    // Parse the JSON data from the request body
    const {
      offer,
      name,
      description,
      askingPrice,
      pricePerSF,
      propertyType,
      buildingSize,
      landSize,
      yearBuilt,
      frontage,
      parking,
      leaseAmount,
      address,
      escrow,
    } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Construct the DynamoDB update parameters
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

    // Update the item in DynamoDB
    await dynamodb.update(dbParams).promise();

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" })
      });
      // Revalidate all paginated listing pages
      const data = await dynamodb.scan({ TableName: "properties" }).promise();
      const totalProperties = data.Items ? data.Items.length : 0;
      const ITEMS_PER_PAGE = 9;
      const totalPages = Math.max(1, Math.ceil(totalProperties / ITEMS_PER_PAGE));
      for (let i = 1; i <= totalPages; i++) {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/revalidate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: `/properties/page/${i}` })
        });
      }
    } catch (e) {
      // Ignore revalidation errors
      console.error("Revalidation error:", e);
    }

    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}