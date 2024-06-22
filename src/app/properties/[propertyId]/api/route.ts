import dynamodb from "@/app/lib/dynamodb";
import { NextResponse } from "next/server";
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    region: process.env.AWS_REGION // Replace with your AWS region
  });

export async function GET(_req: Request, {params}: {params: {propertyId: string}}) {
    try {
        if (!params.propertyId) {
            return NextResponse.json({ error: 'Property ID is required' });
        }

        // Retrieve property details from DynamoDB based on ID
        const parameter = {
            TableName: 'properties', // Replace with your DynamoDB table name
            Key: {
                id: params.propertyId.toString(),
            },
        };

        const data = await dynamodb.get(parameter).promise();
        console.log("got data from db")

        // Check if property exists
        if (!data.Item) {
            return NextResponse.json({ error: 'Property not found' });
        }

        // Extract property details from the response data
    const property = data.Item;


    const fullImageUrl = property.imageUrl;
    const imageFolder = new URL(fullImageUrl).pathname.substring(1);
    console.log("Listing objects in folder:", imageFolder);

    const imageKeys = await listObjectsInFolder(imageFolder);

    if (imageKeys.length === 0) {
      console.warn("No images found in folder:", imageFolder);
    } else {
      console.log("Found image keys:", imageKeys);
    }

    const imageUrls = imageKeys.map(key => {
      return s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: key,
        Expires: 60 * 60 // 1 hour
      });
    });

    property.imageUrls = imageUrls;
    console.log("Generated image URLs:", imageUrls);

        // Return the property details
        return NextResponse.json(property);
    } catch (error) {
        console.error('Error retrieving property:', error);
        NextResponse.json({ error: 'Failed to retrieve property' });
    }
}

async function listObjectsInFolder(folder: string): Promise<string[]> {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string, // Replace with your S3 bucket name
        Prefix: folder,
    };

    const response = await s3.listObjectsV2(params).promise();
    return response.Contents ? response.Contents.map(item => item.Key!) : [];
}