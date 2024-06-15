"use client";
import ContactForm from "../../components/contact_form";
import Image from "next/image";
import LANight from "../../assets/LANight.jpg";
import Navbar from "../../components/nav";
import { useEffect, useState } from "react";
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
  // const id  = params.propertyId;

  // const [property, setProperty] = useState<Property>();

  // console.log("Getting id: ", id);
  // useEffect(() => {
  //     async function fetchProperty() {
  //         if (id) {
  //             const res = await axios.get(`/properties/${id}/api`);
  //             setProperty(res.data);
  //         }
  //     }

  //     fetchProperty();

  // }, [id]);

  // if (!property) {
  //     return <div>Loading...</div>;
  // }

  // console.log(property);
  const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };
  const SLIDE_COUNT = 5;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

  const data = [
    { key: "Price", value: "2000" },
    { key: "Offer", value: "For Lease" },
    { key: "Property Type", value: "Warehouse" },
    { key: "Building Size", value: "9,600 SF" },
    { key: "Land Size", value: "10,945 SF" },
    { key: "Year Built", value: "1957" },
    { key: "PARKING", value: "23 Spots" },
  ];

  return (
    <>
      <Navbar />
      <div className=" flex justify-center mt-32 font-bold font">
        <div className="w-1/2 mb-8">
          <h5 className=" text-lg mb-3 text-red-500">For Lease</h5>
          <h1 className=" text-4xl font-light">1015 Fort Salonga Rd</h1>
          <h1 className=" text-4xl font-light">Northport, NY</h1>
          <h1 className=" text-4xl font-light">11768</h1>
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
