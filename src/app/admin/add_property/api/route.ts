import dynamodb from "@/app/lib/dynamodb";
import Property from "@/app/models/property";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const config = {
    api: {
        bodyParser: true
    },
    maxDuration: 5,
}

// POST /api/properties
export async function POST(req: Request) {
    try {
        // Extract property data from request body
        const { propertyType, buildingSize, landSize, yearBuilt, tenancy, address }: Property = await req.json();
        const { street, city, state, zipCode } = address;
        
        // Perform validation if needed
        if (!propertyType || !buildingSize || !landSize || !yearBuilt || !tenancy || !street || !city || !state || !zipCode) {
            return NextResponse.json({ error: 'Incomplete property data' });
        }

        const id = uuidv4();

        // Save property data to DynamoDB
        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
            Item: {
                id,
                propertyType,
                buildingSize,
                landSize,
                yearBuilt,
                tenancy,
                address: {
                    street,
                    city,
                    state,
                    zipCode
                }
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

// GET /api/properties
export async function GET(req: Request) {
    try {
        // Retrieve all properties from DynamoDB
        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
        };

        const data = await dynamodb.scan(params).promise();

        // Extract the items from the response data
        const properties: Property[] = data.Items as Property[];

        // Return the list of properties
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error retrieving properties:', error);
        return NextResponse.json({ error: 'Failed to retrieve properties' });
    }
}
