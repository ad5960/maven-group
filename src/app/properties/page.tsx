"use client"
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/nav";
import SantaMonica from "../assets/SantaMonica.jpg"
import PropertyCard from "../components/property_card";
import { BlackTag } from "../components/tag";
import { useEffect, useState } from "react";
import axios from "axios";
import Property, { OfferType } from "../models/property";
export default function Page() {
    const [properties, setProperties] = useState<Property[]>([])
    const [offerType, setOfferType] = useState<OfferType | null>(null);
    useEffect(() => {
      async function fetchProperties() {
        const res = await axios.get("/properties/api");
        setProperties(res.data);
      }

      fetchProperties();
    }, [])
    
    // Filter properties based on the selected offer type
    const filteredProperties = offerType == null || offerType == OfferType.All? properties : properties.filter(property => property.offer === offerType);
    return (
        <>
            <Navbar/>
            <div className="w-full h-10 mt-32">
                <span className="w-1/2 justify-center items-center"><p className="text-4xl font-bold text-center">Properties</p></span>
            </div>
            <div className="flex w-full h-20 justify-center items-center px-24 my-10">
                <div className="flex flex-row w-2/3 h-full bg-slate-300  justify-around items-center rounded-lg">
                    <select className="w-1/3 h-1/2 mx-2 border border-slate-400 rounded-lg">
                        <option value="option1">Location</option>
                        <option value="option2">Culver City</option>
                        <option value="option3">Los Angeles</option>
                    </select>
                    <select className="w-1/3 h-1/2 mx-2 border border-slate-400 rounded-lg">
                        <option value="option1">Type</option>
                        {Object.values(OfferType).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button className="w-1/3 h-1/2 mx-2 bg-slate-700 text-white rounded-lg">
                        Update
                    </button>
                </div>
            </div>
            <div className="flex w-full h-4 justify-center items-center px-24 my-2">
                <div className="flex flex-row w-2/3 justify-start items-center relative">
                    <p className="text-xl text-center">Select: </p>
                    <BlackTag offerType={OfferType.All} onClick={() => setOfferType(OfferType.All)} />
                    <BlackTag offerType={OfferType.ForLease} onClick={() => setOfferType(OfferType.ForLease)} />
                    <BlackTag offerType={OfferType.ForSale} onClick={() => setOfferType(OfferType.ForSale)} />
                    <BlackTag offerType={OfferType.ForSaleOrLease} onClick={() => setOfferType(OfferType.ForSaleOrLease)} />
                    <BlackTag offerType={OfferType.Sold} onClick={() => setOfferType(OfferType.Sold)} />

                </div>
            </div>
            <div className="flex flex-wrap justify-between items-center my-20">
                {
                    filteredProperties.map((property, index) => (
                        <div className="w-1/3 p-5" key={property.id}>
                            <PropertyCard
                                name={property.frontage}
                                imageUrl=""
                                link={`/properties/${property.id}`}
                                offer={property.offer}
                            />
                            {(index + 1) % 3 === 0 && <div className="w-full"></div>}
                        </div>
                    ))    
                }
            </div>
        </>
    )
}
