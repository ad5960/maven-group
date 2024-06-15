import dynamodb from "@/app/lib/dynamodb";
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
