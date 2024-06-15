"use client";
import ContactForm from "../../components/contact_form";
import Image from "next/image";
import LANight from "../../assets/LANight.jpg";
import Navbar from "../../components/nav";
import { useEffect, useRef, useState } from "react";
import Property from "@/app/models/property";
import axios from "axios";
import Footer from "@/app/components/footer";
import { EmblaOptionsType } from "embla-carousel";
import EmblaCarousel from "@/app/components/carousel";
import { CardComponent } from "@/app/components/card";

export default function SingleProperty({
  params,
}: {
  params: { propertyId: string };
}) {
  const id = params.propertyId;
  const [property, setProperty] = useState<Property | null>(null);
  const fetchInitiated = useRef(false);

  useEffect(() => {
    async function fetchProperty() {
      if (id && !fetchInitiated.current) {
        fetchInitiated.current = true;
        try {
          const res = await axios.get(`/properties/${id}/api`);
          setProperty(res.data);
          console.log("Fetched property:", res.data);
        } catch (error) {
          console.error("Error fetching property:", error);
        }
      }
    }

    fetchProperty();
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }


  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  const data = [
    { key: "Price", value: property.askingPrice },
    { key: "Offer", value: property.offer },
    { key: "Property Type", value: property.propertyType },
    { key: "Building Size", value: property.buildingSize },
    { key: "Land Size", value: property.landSize },
    { key: "Year Built", value: property.yearBuilt },
    { key: "PARKING", value: property.parking },
  ];

  return (
    <>
      <Navbar />
      <div className=" flex justify-center mt-32 font-bold font">
        <div className="w-1/2 mb-8">
          <h5 className=" text-lg mb-3 text-red-500">{property.offer }</h5>
          <h1 className=" text-4xl font-light">{property.address.street}</h1>
          <h1 className=" text-4xl font-light">{property.address.city}, {property.address.state }</h1>
          <h1 className=" text-4xl font-light">{property.address.zipCode}</h1>
        </div>
      </div>
      <div className="flex  justify-center">
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </div>

      <div className="w-full flex justify-center my-8">
        <div className="w-1/2 border-t border-gray-400"></div>
      </div>
      <section className="main-content flex">
        <div className="info-section">
          <div className="">
            <h1 className=" text-4xl pt-5 font-bold">Description</h1>
            <p className="pt-5 font-light mb-10">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae a
              iste similique dolor optio veniam laudantium unde adipisci
              doloribus illo?
            </p>
            <h1 className="text-4xl font-bold pb-5">Details</h1>
            <ul>
              {data.map((item, index) => (
                <li key={index} className="grid grid-cols-3 py-2">
                  <span className="font-semibold">{item.key}</span>
                  <span>{item.value}</span>
                </li>
              ))}
              <h1 className="text-4xl font-bold pb-5 mt-10">Download</h1>

            </ul>
          </div>
        </div>
        <div className=" side-content mt-10">
                  <h1 className="text-3xl font-semibold pb-5 mt-10 text-center">Contact An Agent</h1>
                  <div className="contact-section">
                      <CardComponent/>
                  </div>
        </div>
          </section>
          <Footer/>
    </>
  );
}
