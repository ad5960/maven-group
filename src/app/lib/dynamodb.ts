import AWS from 'aws-sdk';

// Set the region and credentials for DynamoDB
AWS.config.update({
    region: 'us-west-2', // Replace 'your-region' with your AWS region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "access_key", // Replace 'your-access-key-id' with your AWS access key ID
        secretAccessKey: process.env.AWS_ACCESS_SECRET || "access_secret" // Replace 'your-secret-access-key' with your AWS secret access key
    }
});

// Create a DynamoDB DocumentClient
const dynamodb = new AWS.DynamoDB.DocumentClient();

export default dynamodb;
