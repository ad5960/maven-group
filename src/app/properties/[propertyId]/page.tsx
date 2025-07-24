import Navbar from "../../components/nav";
import Footer from "../../components/footer";
import { EmblaOptionsType } from "embla-carousel";
import dynamic from "next/dynamic";
const EmblaCarousel = dynamic(() => import("../../components/carousel"), { ssr: false });
import { CardComponent } from "../../components/card";
import Property from "../../models/property";
import dynamodb from "../../lib/dynamodb";
import AWS from "aws-sdk";
import { notFound } from "next/navigation";

export const revalidate = 600; // ISR: Revalidate every 10 minutes

async function getPropertyById(id: string) {
  const data = await dynamodb.get({ TableName: "properties", Key: { id } }).promise();
  if (!data.Item) return null;
  const property = data.Item as Property;
  // Fetch all images for the property
  if (property.imageUrl) {
    const s3 = new AWS.S3({ region: process.env.AWS_REGION });
    const fullImageUrl = property.imageUrl;
    const imageFolder = new URL(fullImageUrl).pathname.substring(1);
    const response = await s3.listObjectsV2({
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Prefix: imageFolder,
    }).promise();
    const imageKeys = response.Contents
      ? response.Contents.map((item) => item.Key!).filter((key) => !key.endsWith("/"))
      : [];
    property.imageUrls = imageKeys.map((key) => encodeURI("https://d2cw6pmn7dqyjd.cloudfront.net/" + key));
  } else {
    property.imageUrls = [];
  }
  return property;
}

export async function generateStaticParams() {
  const data = await dynamodb.scan({ TableName: "properties" }).promise();
  const properties = data.Items as Property[];
  return properties.map((property) => ({ propertyId: property.id }));
}

export default async function SingleProperty({ params }: { params: { propertyId: string } }) {
  const property = await getPropertyById(params.propertyId);
  if (!property) notFound();

  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };

  // Combine static fields and custom fields
  const data = [
    { key: "Offer", value: property.offer },
    { key: "Price", value: property.askingPrice },
    ...(property.offer === 'For Lease' || property.offer === 'For Sale or Lease'
      ? [{ key: "Lease Amount", value: property.leaseAmount }]
      : []),
    { key: "Property Type", value: property.propertyType },
    { key: "Building Size", value: property.buildingSize },
    { key: "Land Size", value: property.landSize },
    { key: "Year Built", value: property.yearBuilt },
    { key: "Parking", value: property.parking },
    ...(property.customFields ? property.customFields.map((field: any) => ({
      key: field.key,
      value: field.value,
    })) : [])
  ];

  return (
    <div className="relative">
      <Navbar />
      <div className="flex justify-center mt-32 ml-8 font-bold">
        <div className="w-full md:w-1/2 mb-8">
          <h5 className="text-lg mb-3 text-red-500">{property.offer}</h5>
          <h1 className="text-3xl md:text-4xl font-light">{property.address.street}</h1>
          <h1 className="text-3xl md:text-4xl font-light">{property.address.city}, {property.address.state}</h1>
          <h1 className="text-3xl md:text-4xl font-light">{property.address.zipCode}</h1>
        </div>
      </div>
      <div className="flex justify-center">
        <EmblaCarousel slides={property.imageUrls} options={OPTIONS} />
      </div>

      <div className="w-full flex justify-center my-8">
        <div className="w-full mx-2 md:w-2/3 border-t border-gray-400"></div>
      </div>

      <section className="main-content flex flex-col md:flex-row">
        <div className="info-section">
          <h1 className="text-4xl pt-5 font-bold">Description</h1>
          <p className="pt-5 font-light mb-10">{property.description}</p>
          <h1 className="text-4xl font-bold pb-5">Details</h1>
          <ul>
            {data.map((item, index) => (
              <li key={index} className="grid grid-cols-3 gap-4 py-2">
                <span className="font-semibold">{item.key}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
          <h1 className="text-4xl font-bold pb-5 mt-10">Download</h1>
          <ul>
            {property.pdfUrls && property.pdfUrls.length > 0 ? (
              property.pdfUrls.map((pdfUrl: string, index: number) => (
                <li key={index}>
                  <a className="text-blue-700" href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    {`Brochure ${index + 1}`}
                  </a>
                </li>
              ))
            ) : (
              <p>No Property Information Sheet available for download.</p>
            )}
          </ul>
        </div>
        <div className="side-content w-full md:w-2/5 mt-10 md:mt-0 px-4 md:px-0 md:mx-8">
          <h1 className="text-3xl font-semibold pb-5 mt-10 text-center">Contact An Agent</h1>
          <div className="contact-section">
            <CardComponent agentName={property.agent || "Christopher Mavian"} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

