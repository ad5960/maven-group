import dynamodb from "@/app/lib/dynamodb";
import Property, { OfferType } from "@/app/models/property";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";


const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_ACCESS_SECRET as string,
    },
});


const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;


// Function for adding images to s3 bucket
async function uploadFilesToS3(files: File[], folderName: string) {
    const fileUrls = await Promise.all(
        files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${folderName}/${file.name}`;
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME as string,
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

const BUCKET_NAME_ATTACHMENTS = "mavenattachments";

// Function for uploading PDFs to the S3 bucket
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
                    ContentType: 'application/pdf', // Ensure this is correct
                };
                const command = new PutObjectCommand(params);
                const response = await s3Client.send(command);
                console.log(`Uploaded PDF: ${filename} - Response:`, response);
                return `https://mavenattachments.s3.amazonaws.com/${filename}`;
            } catch (error) {
                console.error(`Failed to upload PDF: ${file.name}`, error);
                throw error;
            }
        })
    );
    return fileUrls;
}



export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const fileList = formData.getAll("files");
        const files = fileList.filter((item): item is File => item instanceof File);

        const pdfFileList = formData.getAll("pdfs");
        const pdfFiles = pdfFileList.filter((item): item is File => item instanceof File);

        const offer = formData.get("offer")?.toString();
        const name = formData.get("name")?.toString();
        const description = formData.get("description")?.toString();
        const leaseAmount = formData.get("leaseAmount")?.toString();
        const askingPrice = formData.get("askingPrice")?.toString();
        const pricePerSF = formData.get("pricePerSF")?.toString();
        const propertyType = formData.get("propertyType")?.toString();
        const buildingSize = formData.get("buildingSize")?.toString();
        const landSize = formData.get("landSize")?.toString();
        const yearBuilt = formData.get("yearBuilt")?.toString();
        const frontage = formData.get("frontage")?.toString();
        const parking = formData.get("parking")?.toString();
        const street = formData.get("street")?.toString();
        const city = formData.get("city")?.toString();
        const state = formData.get("state")?.toString();
        const zipCode = formData.get("zipCode")?.toString();
        const agent = formData.get("selectedAgent")?.toString();
        const escrow = formData.get("escrow")?.toString();

        const customFields = [];
        let index = 0;

        while (true) {
            const key = formData.get(`customFields[${index}][key]`);
            const value = formData.get(`customFields[${index}][value]`);
            if (key && value) {
                customFields.push({ key: key.toString(), value: value.toString() });
                index++;
            } else {
                break; // Exit the loop when no more custom fields are found
            }
        }

        if (files.length === 0) {
            return NextResponse.json({ error: "At least one file is required." });
        }

        const folderName = `${street}_${city}_${state}_${zipCode}`.replace(/ /g, "_");
        const fileUrls = await uploadFilesToS3(files, folderName);

        const pdfUrls = await uploadPdfsToS3(pdfFiles, folderName);

        const id = uuidv4();
        const params = {
            TableName: "properties",
            Item: {
                id,
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
                address: { street, city, state, zipCode },
                imageUrl: `https://mavenpropertyimages.s3.amazonaws.com/${folderName}/`,
                pdfUrls,
                customFields,
                agent,
                escrow
            },
        };

        await dynamodb.put(params).promise();

        return NextResponse.json({ success: true, message: "Property created successfully" });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json({ error: "Failed to create property" });
    }
}

// GET function for all properties
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('type');
    const offerType = searchParams.get('offerType');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10); // Default to 9 items per page

    try {
        const params = {
            TableName: 'properties',
        };

        const data = await dynamodb.scan(params).promise();
        let properties: Property[] = data.Items as Property[];

        // Apply filters
        if (location && location !== "option1") {
            properties = properties.filter(property => property.address.city === location);
        }

        if (propertyType && propertyType !== "option1") {
            properties = properties.filter(property => property.propertyType === propertyType);
        }

        if (offerType && offerType !== OfferType.All) {
            if (offerType === OfferType.ForSale) {
                properties = properties.filter(property => 
                    property.offer === OfferType.ForSale || property.offer === OfferType.ForSaleOrLease
                );
            } else if (offerType === OfferType.ForLease) {
                properties = properties.filter(property => 
                    property.offer === OfferType.ForLease || property.offer === OfferType.ForSaleOrLease
                );
            } else {
                properties = properties.filter(property => property.offer === offerType);
            }
        }

        // Calculate pagination values
        const totalItems = properties.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Slice the properties array to get the items for the current page
        const paginatedProperties = properties.slice(startIndex, endIndex);

        // Fetch the first image URL for each property (unchanged)
        for (let property of paginatedProperties) {
            if (property.imageUrl) {
                const fullImageUrl = property.imageUrl;
                const imageFolder = new URL(fullImageUrl).pathname.substring(1);

                const imageKeys = await listObjectsInFolder(imageFolder);

                if (imageKeys.length === 0) {
                    console.warn("No images found in folder:", imageFolder);
                } else {
                    property.imageUrls = ["https://d2cw6pmn7dqyjd.cloudfront.net/" + imageKeys[0]];
                }
            }
        }

        // Return paginated data along with pagination metadata
        return NextResponse.json({
            properties: paginatedProperties,
            totalItems,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error retrieving properties:', error);
        return NextResponse.json({ error: 'Failed to retrieve properties' });
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
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json(); // Assuming you send the property ID in the request body

        const params = {
            TableName: "properties",
            Key: { id },
        };

        await dynamodb.delete(params).promise();

        return NextResponse.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        return NextResponse.json({ error: "Failed to delete property" });
    }
}
