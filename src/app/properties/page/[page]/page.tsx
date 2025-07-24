import Navbar from "../../../components/nav";
import PropertyCard from "../../../components/property_card";
import { LOCATIONS, PROPERTY_TYPES } from "../../../lib/constants";
import Footer from "../../../components/footer";
import Property, { OfferType } from "../../../models/property";
import dynamodb from "../../../lib/dynamodb";
import AWS from "aws-sdk";
import { notFound } from "next/navigation";

export const revalidate = 600; // ISR: Revalidate every 10 minutes

const ITEMS_PER_PAGE = 9;

async function getAllProperties() {
  const data = await dynamodb.scan({ TableName: "properties" }).promise();
  const properties = data.Items as Property[];
  // Sort active first, then sold
  properties.sort((a, b) => {
    const aIsActive = a.offer !== OfferType.Sold;
    const bIsActive = b.offer !== OfferType.Sold;
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    return 0;
  });
  const s3 = new AWS.S3({ region: process.env.AWS_REGION });
  await Promise.all(
    properties.map(async (property) => {
      if (property.imageUrl) {
        const fullImageUrl = property.imageUrl;
        const imageFolder = new URL(fullImageUrl).pathname.substring(1);
        try {
          const response = await s3.listObjectsV2({
            Bucket: process.env.AWS_S3_BUCKET_NAME as string,
            Prefix: imageFolder,
          }).promise();
          const imageKeys = response.Contents
            ? response.Contents.map((item) => item.Key!).filter((key) => !key.endsWith("/"))
            : [];
          property.imageUrls = imageKeys.length > 0
            ? ["https://d2cw6pmn7dqyjd.cloudfront.net/" + imageKeys[0]]
            : [];
        } catch {
          property.imageUrls = [];
        }
      } else {
        property.imageUrls = [];
      }
    })
  );
  return properties;
}

export async function generateStaticParams() {
  const properties = await getAllProperties();
  const totalPages = Math.max(1, Math.ceil(properties.length / ITEMS_PER_PAGE));
  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
}

export default async function Page({ params }: { params: { page: string } }) {
  const pageNum = parseInt(params.page, 10);
  if (isNaN(pageNum) || pageNum < 1) notFound();

  const properties = await getAllProperties();
  const totalPages = Math.max(1, Math.ceil(properties.length / ITEMS_PER_PAGE));
  if (pageNum > totalPages) notFound();

  const startIdx = (pageNum - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginated = properties.slice(startIdx, endIdx);

  return (
    <>
      <Navbar />
      <div className="w-full h-10 mt-44 flex justify-center items-center">
        <span className="w-11/12 md:w-1/2">
          <p className="text-2xl md:text-4xl font-bold text-center">Properties</p>
        </span>
      </div>
      <div className="flex w-full justify-center items-center my-10">
        <div className="w-full lg:w-2/3 bg-gradient-to-r from-gray-50 to-gray-100 shadow-xl rounded-2xl p-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Filter Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            {/* Filter UI is static for now */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Location</label>
              <select className="w-full h-11 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700" disabled>
                <option value="option1">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Property Type</label>
              <select className="w-full h-11 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700" disabled>
                <option value="option1">All Types</option>
                {PROPERTY_TYPES.map((ptype) => (
                  <option key={ptype} value={ptype}>{ptype}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Offer Type</label>
              <select className="w-full h-11 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700" disabled>
                <option value={OfferType.All}>All Offers</option>
                <option value={OfferType.ForSale}>For Sale</option>
                <option value={OfferType.ForLease}>For Lease</option>
                <option value={OfferType.ForSaleOrLease}>For Sale or Lease</option>
                <option value={OfferType.Sold}>Sold</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <button className="w-full h-11 bg-blue-500 text-white rounded-lg font-medium text-sm shadow-sm" disabled>Search</button>
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <button className="w-full h-11 bg-transparent text-gray-600 rounded-lg font-medium text-sm border border-gray-300" disabled>Clear All</button>
            </div>
          </div>
        </div>
      </div>
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Properties Found</h3>
            <p className="text-gray-500 mb-6">
              No properties match your current filters. Try adjusting your search criteria or reset the filters.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center my-8">
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
              {paginated.map((property: Property) => (
                <PropertyCard
                  key={property.id}
                  name={property.name}
                  escrow={property.escrow}
                  description={property.description}
                  address={property.address}
                  imageUrl={property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : ''}
                  link={`/properties/${property.id}`}
                  offer={property.offer}
                  price={
                    property.offer === "For Sale" || property.offer === "Sold"
                      ? property.askingPrice
                      : property.offer === "For Lease"
                      ? property.pricePerSF
                      : property.askingPrice + " or " + property.pricePerSF
                  }
                />
              ))}
            </div>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center my-4">
            <div className="flex space-x-2">
              <a href={`/properties/page/${Math.max(pageNum - 1, 1)}`}
                className={`px-3 py-1 bg-gray-200 rounded ${pageNum === 1 ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={pageNum === 1}
              >
                Previous
              </a>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <a
                  key={page}
                  href={`/properties/page/${page}`}
                  className={`px-3 py-1 rounded ${pageNum === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {page}
                </a>
              ))}
              <a href={`/properties/page/${Math.min(pageNum + 1, totalPages)}`}
                className={`px-3 py-1 bg-gray-200 rounded ${pageNum === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={pageNum === totalPages}
              >
                Next
              </a>
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
} 