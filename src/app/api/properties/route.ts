import dynamodb from "@/app/lib/dynamodb";
import Property, { OfferType } from "@/app/models/property";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_ACCESS_SECRET as string,
    },
});

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
            return `https://mavenimages.s3.amazonaws.com/${filename}`;
        })
    );
    return fileUrls;
}

export const config = {
    api: {
        bodyParser: false, // Disable Next.js body parsing
    },
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const fileList = formData.getAll("files");
        const files = fileList.filter((item): item is File => item instanceof File);

        const offer = formData.get("offer")?.toString();
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
            TableName: "properties", // Replace with your DynamoDB table name
            Item: {
                id,
                offer,
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
                imageUrl: `https://mavenimages.s3.amazonaws.com/${folderName}/`,
            },
        };

        await dynamodb.put(params).promise();

        return NextResponse.json({ success: true, message: "Property created successfully" });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json({ error: "Failed to create property" });
    }
}

// Search function for properties
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const propertyType = searchParams.get('type');
    const offerType = searchParams.get('offerType');
    try {
        // Example: Retrieve all agents from DynamoDB
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
        // Return the list of agents
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error retrieving properties:', error);
        return NextResponse.json({ error: 'Failed to retrieve properties' });
    }
}

// GET /api/properties/:id
// export async function getById(req: Request) {
//     console.log("Landed in getById method!")
//     try {
//         const reqUrl = req.url.split("/");
//         const id = reqUrl[reqUrl.length - 1]
//         console.log("id: ", id);
//         // Check if ID is provided
//         if (!id) {
//             return NextResponse.json({ error: 'Property ID is required' });
//         }

//         // Retrieve property details from DynamoDB based on ID
//         const params = {
//             TableName: 'properties', // Replace with your DynamoDB table name
//             Key: {
//                 id: id.toString(),
//             },
//         };

//         const data = await dynamodb.get(params).promise();

//         // Check if property exists
//         if (!data.Item) {
//             return NextResponse.json({ error: 'Property not found' });
//         }

//         // Extract property details from the response data
//         const property: Property = data.Item as Property;

//         // Return the property details
//         NextResponse.json(property);
//     } catch (error) {
//         console.error('Error retrieving property:', error);
//         NextResponse.json({ error: 'Failed to retrieve property' });
//     }
// }