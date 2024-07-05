import dynamodb from "@/app/lib/dynamodb";
import Agent from "@/app/models/agent";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { agentId: string } }) {
    try {

        if (!params.agentId) {
            return NextResponse.json({ error: 'Agent ID is required' });
        }

        // Retrieve property details from DynamoDB based on agentId
        const parameter = {
            TableName: 'agents', // Replace with your DynamoDB table name
            Key: {
                id: params.agentId.toString(),
            },
        };

        const data = await dynamodb.get(parameter).promise();

        // Check if property exists
        if (!data.Item) {
            return NextResponse.json({ error: 'Agent not found' });
        }

        // Extract property details from the response data
        const agent: Agent = data.Item as Agent;

        // Return the property details
        return NextResponse.json(agent);
    } catch (error) {
        console.error('Error retrieving agent:', error);
        return NextResponse.json({ error: 'Failed to retrieve agent' });
    }
}