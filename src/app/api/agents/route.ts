import dynamodb from "@/app/lib/dynamodb";
import Agent from "@/app/models/agent";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"
// export const config = {
//     api: {
//         bodyParser: true
//     },
//     // Specifies the maximum allowed duration for this function to execute (in seconds)
//     maxDuration: 5,
// }

// POST /api/agents
export async function POST(req: Request) {

    try {
        // Extract agent data from request body
        const { name, email, phoneNumber, licenseNumber, photo }: Agent = await req.json();
        console.log("Name: ", name, "Email: ", email, "Phone: ", phoneNumber, "License: ", licenseNumber, "Photo: ", photo)

        // Example: Perform validation if needed
        if (!name || !email || !phoneNumber || !licenseNumber || !photo) {
            return NextResponse.json({ error: 'Incomplete agent data' });
        }

        const id = uuidv4()

        // Example: Save agent data to DynamoDB
        const params = {
            TableName: 'agents', // Replace with your DynamoDB table name
            Item: {
                id,
                name,
                email,
                phoneNumber,
                licenseNumber,
                photo
            }
        };


        await dynamodb.put(params).promise();

        // Return success response
        return NextResponse.json({ success: true, message: 'Agent created successfully' });
    } catch (error) {
        console.error('Error creating agent:', error);
        return NextResponse.json({ error: 'Failed to create agent' });
    }

}

// GET /api/agents
export async function GET(req: Request) {
    try {
        // Example: Retrieve all agents from DynamoDB
        const params = {
            TableName: 'agents', // Replace with your DynamoDB table name
        };

        const data = await dynamodb.scan(params).promise();

        // Extract the items from the response data
        const agents: Agent[] = data.Items as Agent[];

        // Return the list of agents
        return NextResponse.json(agents);
    } catch (error) {
        console.error('Error retrieving agents:', error);
        return NextResponse.json({ error: 'Failed to retrieve agents' });
    }
}