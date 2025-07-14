"use client";
import Navbar from "../../components/nav";
import { useEffect, useRef, useState } from "react";
import Property from "@/app/models/property";
import axios from "axios";
import Footer from "@/app/components/footer";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/app/components/carousel";
import { CardComponent } from "@/app/components/card";
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function SingleProperty({
  params,
}: {
  params: { propertyId: string };
}) {
  const id = params.propertyId;

  const { data: property, error, isLoading } = useSWR(
    id ? `/api/properties/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (error) {
    return <div>Error loading property</div>;
  }

  if (isLoading || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

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

