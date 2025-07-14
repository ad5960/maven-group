"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/nav";
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import Property from "./models/property";
import axios from "axios";
import PropertyCard from "./components/property_card";
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Page() {
  const { data, error, isLoading } = useSWR('/api/properties/?limit=6', fetcher, {
    revalidateOnFocus: false,
  });

  const properties = data?.properties || [];

  return (
    <>
      <div className="relative">
        <Navbar />
        <div className="w-full h-screen relative">
          <Image
            src="https://d2m41b1lxy01wm.cloudfront.net/beach.jpg"
            alt="Los Angeles Night"
            layout="fill"
            objectFit="cover"
            className="filter brightness-75"
          />
        </div>

        <section className="mt-20">
          <div className="flex flex-col md:flex-row items-stretch md:space-x-0">
            <div className="md:flex-1 w-full">
              <div className="relative w-full aspect-square xl:aspect-video">
                <Image
                  src="https://d2m41b1lxy01wm.cloudfront.net/expert.jpg"
                  alt="Office"
                  layout="fill"
                  objectFit="cover"
                  className="shadow-lg"
                />
              </div>
            </div>
            <div className="md:flex-1 w-full p-4 sm:p-10 bg-customBackground flex flex-col justify-center">
              <h1 className="text-lg sm:text-xl font-bold">We are Mavian</h1>
              <p className="text-sm sm:text-md mt-2 sm:mt-4">
                As experts in property sales, landlord representation, and tenant
                representation, we bring a wealth of experience and a deep
                understanding of the real estate market to the table. Our expertise
                in property sales ensures that clients receive top-notch guidance
                throughout the buying or selling process, maximizing their
                investment potential.
              </p>
              <a
                href="/services"
                className="inline-block text-sm font-Roboto font-medium border border-black text-black bg-transparent py-3 px-6 mt-6 sm:mt-9 self-start"
              >
                LEARN MORE
              </a>
            </div>
          </div>
        </section>

        <div className="flex justify-center items-center text-3xl mt-20 font-semibold">
          <h1>Properties</h1>
        </div>

        <div className="flex justify-center items-center mt-10">
          <div className="py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                
                name={property.name}
                description={property.description}
                address={property.address}
                imageUrl={
                  property.imageUrls && property.imageUrls.length > 0
                    ? property.imageUrls[0]
                    : ""
                }
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
              
            ))
            }
          </div>
        </div>

        <div className="flex justify-center mb-20">
          <div className="center">
            <Link href="/properties">
              <button className="btn">
                <svg
                  width="180px"
                  height="60px"
                  viewBox="0 0 180 60"
                  className="border button-svg"
                >
                  <polyline
                    points="179,1 179,59 1,59 1,1 179,1"
                    className="bg-line"
                  />
                  <polyline
                    points="179,1 179,59 1,59 1,1 179,1"
                    className="hl-line"
                  />
                </svg>
                <span>View More</span>
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
