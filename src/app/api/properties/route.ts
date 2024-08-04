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


// POST function for adding new property
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const fileList = formData.getAll("files");
        const files = fileList.filter((item): item is File => item instanceof File);

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
        const attachments = formData.get("attachments")?.toString()?.split(",");
        const street = formData.get("street")?.toString();
        const city = formData.get("city")?.toString();
        const state = formData.get("state")?.toString();
        const zipCode = formData.get("zipCode")?.toString();

        if (files.length === 0) {
            return NextResponse.json({ error: "At least one file is required." });
        }

        const folderName = `${street}_${city}_${state}_${zipCode}`.replace(/ /g, "_");
        const fileUrls = await uploadFilesToS3(files, folderName);

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
                downloads: { attachments },
                address: { street, city, state, zipCode },
                imageUrl: `https://mavenpropertyimages.s3.amazonaws.com/${folderName}/`,
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
    const limit = searchParams.get('limit');
    try {
        
        const params = {
            TableName: 'properties',
            Limit: limit ? parseInt(limit) : undefined,
        };

        const data = await dynamodb.scan(params).promise();

        // Extract the items from the response data
        let properties: Property[] = data.Items as Property[];

        // Filter properties based on the query parameters
        if (location && location !== "option1") {
            properties = properties.filter(property => property.address.city === location);
        }

        if (propertyType && propertyType !== "option1") {
            properties = properties.filter(property => property.propertyType === propertyType);
        }

        if (offerType && offerType !== OfferType.All) {
            properties = properties.filter(property => property.offer === offerType);
        }
                // Fetch the first image URL for each property
                for (let property of properties) {
                    if (property.imageUrl) {
                        const fullImageUrl = property.imageUrl;
                        const imageFolder = new URL(fullImageUrl).pathname.substring(1);
        
                        const imageKeys = await listObjectsInFolder(imageFolder);
        
                        if (imageKeys.length === 0) {
                            console.warn("No images found in folder:", imageFolder);
                        } else {
        
                            property.imageUrls = ["https://d2cw6pmn7dqyjd.cloudfront.net/" + imageKeys[0]]; // Assign only the first image URL
                        }
                    }
                }

        // Return the list of properties
        return NextResponse.json(properties);
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
