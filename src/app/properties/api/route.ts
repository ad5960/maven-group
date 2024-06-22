import dynamodb from "@/app/lib/dynamodb";
import Property, { OfferType } from "@/app/models/property";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"
import AWS from 'aws-sdk';
export const config = {
    api: {
        bodyParser: true
    },
    // Specifies the maximum allowed duration for this function to execute (in seconds)
    maxDuration: 5,
}

const s3 = new AWS.S3({
    region: process.env.AWS_REGION // Replace with your AWS region
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string;

// POST /api/agents
export async function POST(req: Request) {

    try {
        // Extract agent data from request body
        const { offer, askingPrice, pricePerSF, propertyType, buildingSize, landSize, yearBuilt,  frontage, parking,  downloads: { attachments },
            address: { street, city, state, zipCode }, }: Property = await req.json();

        // Example: Perform validation if needed
        if (!offer || !askingPrice || !pricePerSF || !propertyType || !buildingSize || !landSize || !yearBuilt || !frontage || !parking || attachments.length === 0 || !street || !city || !state || !zipCode) {
            return NextResponse.json({ error: 'Incomplete property data' });
        }

        const id = uuidv4()

        // Example: Save agent data to DynamoDB
        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
            Item: {
                id, offer, askingPrice, pricePerSF, propertyType, buildingSize, landSize, yearBuilt, downloads: { attachments },
                address: { street, city, state, zipCode },
            }
        };


        await dynamodb.put(params).promise();

        // Return success response
        return NextResponse.json({ success: true, message: 'Property created successfully' });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: 'Failed to create property' });
    }

}

// GET /api/agents
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('type');
    const offerType = searchParams.get('offerType');

    try {
        // Example: Retrieve all properties from DynamoDB
        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
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
                    console.log("Found image keys:", imageKeys);

                    const firstImageUrl = s3.getSignedUrl('getObject', {
                        Bucket: BUCKET_NAME,
                        Key: imageKeys[0], // Get the first image key
                        Expires: 60 * 60 // 1 hour
                    });

                    property.imageUrls = [firstImageUrl]; // Assign only the first image URL
                    console.log("Generated first image URL for property:", property.id, firstImageUrl);
                }
            }
        }

        // Return the list of properties
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error retrieving properties:', error);
        return NextResponse.json({ error: 'Failed to retrieve properties' });
    }
}


async function listObjectsInFolder(folder: string): Promise<string[]> {
    const params = {
        Bucket: BUCKET_NAME,
        Prefix: folder,
    };

    const response = await s3.listObjectsV2(params).promise();
    return response.Contents ? response.Contents.map(item => item.Key!) : [];
}

// GET /api/properties/:id
export async function getById(req: Request) {
    console.log("Landed in getById method!")
    try {
        const reqUrl = req.url.split("/");
        const id = reqUrl[reqUrl.length - 1]
        console.log("id: ", id);
        // Check if ID is provided
        if (!id) {
            return NextResponse.json({ error: 'Property ID is required' });
        }

        // Retrieve property details from DynamoDB based on ID
        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
            Key: {
                id: id.toString(),
            },
        };

        const data = await dynamodb.get(params).promise();

        // Check if property exists
        if (!data.Item) {
            return NextResponse.json({ error: 'Property not found' });
        }

        // Extract property details from the response data
        const property: Property = data.Item as Property;

        // Return the property details
        NextResponse.json(property);
    } catch (error) {
        console.error('Error retrieving property:', error);
        NextResponse.json({ error: 'Failed to retrieve property' });
    }
}