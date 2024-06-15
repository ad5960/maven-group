import dynamodb from "@/app/lib/dynamodb";
import Property from "@/app/models/property";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"
export const config = {
    api: {
        bodyParser: true
    },
    // Specifies the maximum allowed duration for this function to execute (in seconds)
    maxDuration: 5,
}

// POST /api/agents
export async function POST(req: Request) {

    try {
        // Extract agent data from request body
        const { offer, askingPrice, pricePerSF, propertyType, buildingSize, landSize, yearBuilt, tenancy, frontage, parking, zoning, highlights, downloads: { attachments },
            address: { street, city, state, zipCode }, }: Property = await req.json();

        // Example: Perform validation if needed
        if (!offer || !askingPrice || !pricePerSF || !propertyType || !buildingSize || !landSize || !yearBuilt || !tenancy || !frontage || !parking || !zoning || highlights.length === 0 || attachments.length === 0 || !street || !city || !state || !zipCode) {
            return NextResponse.json({ error: 'Incomplete property data' });
        }

        const id = uuidv4()

        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
            Item: {
                id, offer, askingPrice, pricePerSF, propertyType, buildingSize, landSize, yearBuilt, tenancy, frontage, parking, zoning, highlights, downloads: { attachments },
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
    try {
        // Example: Retrieve all agents from DynamoDB
        const params = {
            TableName: 'properties', // Replace with your DynamoDB table name
        };

        const data = await dynamodb.scan(params).promise();

        // Extract the items from the response data
        const agents: Property[] = data.Items as Property[];

        // Return the list of agents
        return NextResponse.json(agents);
    } catch (error) {
        console.error('Error retrieving properties:', error);
        return NextResponse.json({ error: 'Failed to retrieve properties' });
    }
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