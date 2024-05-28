import dynamodb from "@/app/lib/dynamodb";
import Property from "@/app/models/property";
import axios from "axios";
import { NextResponse } from "next/server";

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

        // Check if property exists
        if (!data.Item) {
            return NextResponse.json({ error: 'Property not found' });
        }

        // Extract property details from the response data
        const property: Property = data.Item as Property;

        // Return the property details
        return NextResponse.json(property);
    } catch (error) {
        console.error('Error retrieving property:', error);
        NextResponse.json({ error: 'Failed to retrieve property' });
    }
}