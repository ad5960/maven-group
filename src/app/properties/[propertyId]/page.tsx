"use client"
import ContactForm from "../../components/contact_form";
import Image from "next/image";
import LANight from "../../assets/LANight.jpg"
import Navbar from "../../components/nav";
import { useEffect, useState } from "react";
import Property from "@/app/models/property";
import axios from "axios";

export default function SingleProperty({ params }: {params: {propertyId: string}}) {
    const id  = params.propertyId;
    const [property, setProperty] = useState<Property>();

    console.log("Getting id: ", id);
    useEffect(() => {
        async function fetchProperty() {
            if (id) {
                const res = await axios.get(`/properties/${id}/api`);
                setProperty(res.data);
            }
        }
        
        fetchProperty();

    }, [id]);

    if (!property) {
        return <div>Loading...</div>;
    }

    console.log(property);
    return (<>
        <Navbar/>
        <div className="flex mt-20">
            <div className="flex flex-col">
                <div className="flex flex-row mx-20">
                    {/* Listing address and photo*/}
                    <div className="flex flex-1 flex-col justify-evenly mx-10 items-start">
                        {/* Listing address*/}
                        <div>
                        <p className="flex text-xl text-slate-400 font-bold">Listings</p>
                        <p className="text-5xl font-bold">1415 Wilshire Boulevard</p>
                        </div>
                        <hr className="w-1/3 border-2 border-slate-400 my-4"/>
                        <div className="space-y-2">
                        <p className="text-3xl font-bold text-slate-400">.For Sale or Lease - $4,100,000</p>
                        <p className="text-3xl font-bold text-slate-400">Santa Monica, CA 90402</p>
                        <p className="text-3xl font-bold text-slate-400">Retail Space | 4870 square feet</p>
                        </div>
                    </div>
                    <div className="flex flex-1 mx-10 my-16 w-1/3">
                        <Image src={LANight} alt="Listing Image" layout="responsive" width={600} height={600} className="rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-row mx-20 my-10">
                    {/* Listing description and contact form*/}
                    <div className="flex flex-1 flex-col  items-start px-10">
                        {/* Listing description*/}
                        <div className="w-1/2">
                            <p className="flex text-2xl font-bold">Description</p>
                            <p className="text-md font-normal my-4 text-justify">MavenGroup Commercial Brokerage Company is pleased to present the opportunity to acquire 1415 Wilshire Boulevard in Santa Monica, California, retail property located along highly trafficked Wilshire Boulevard, just east of 14th Street. The Property is approximately one (1) mile from Downtown Santa Monica and twenty (20) minutes from Los Angeles International Airport.</p>
                            <p className="flex text-2xl font-bold mt-8">Details</p>
                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Offer</p>
                                <p className="flex flex-1">.For Sale or Lease</p>
                            </div>
                            <hr className="border-1 border-slate-400"/>

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Property Type</p>
                                <p className="flex flex-1">Retail Space</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Building Size</p>
                                <p className="flex flex-1">4878 SF</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Land Size</p>
                                <p className="flex flex-1">5000 SF</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Year Built</p>
                                <p className="flex flex-1">1930</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Tenancy</p>
                                <p className="flex flex-1">Single (Building can be divisible by two)</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Frontage</p>
                                <p className="flex flex-1">50’ along Wilshire Boulevard</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Parking</p>
                                <p className="flex flex-1">
                                    No dedicated (ample metered street parking along Wilshire & a city metered lot across the street)
                                </p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <div className="flex flex-row my-4">
                                <p className="flex flex-1 font-bold">Zoning</p>
                                <p className="flex flex-1">MUB (Mixed-Use Boulevard)</p>
                            </div>
                            <hr className="border-1 border-slate-400" />

                            <p className="flex text-2xl font-bold mt-8">Highlights</p>
                            <ul className="list-disc mx-5 my-5">
                                <li>Excellent, Infill Santa Monica Location</li>
                                <li>High Traffic Retail Corridor</li>
                                <li>Excellent Westside Location with Silicon Beach Drivers</li>
                                <li>Ample Area Amenities</li>
                            </ul>

                            <p className="flex text-2xl font-bold mt-8">Downloads</p>
                            <ul className="list-disc mx-5 my-5">
                                <li><a href="#">Marketing Brochure</a></li>
                            </ul>

                            <p className="flex text-2xl font-bold mt-8">Address</p>
                            <p className="my-5 mb-20">1415 Wilshire Blvd <br/>
                                Santa Monica, CA 90402</p>


                        </div>
                    </div>
                    <div className="flex flex-1 w-full">
                        <ContactForm/>
                    </div>

                </div>
            </div>
        </div>
    </>)
}