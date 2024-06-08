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
import { LOCATIONS, PROPERTY_TYPES } from "../lib/constants";

export default function Page() {
    const [offerType, setOfferType] = useState<OfferType>(OfferType.All);
    const [properties, setProperties] = useState<Property[]>([]);
    const [location, setLocation] = useState<string>("option1");
    const [propertyType, setPropertyType] = useState<string>("option1");

    useEffect(() => {
        fetchProperties();
    }, [offerType]);

    const fetchProperties = async () => {
        try {
            const res = await axios.get("/properties/api", {
                params: {
                    location: location === "option1" ? undefined : location,
                    type: propertyType === "option1" ? undefined : propertyType,
                    offerType: offerType === OfferType.All ? undefined : offerType,
                },
            });
            setProperties(res.data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocation(e.target.value);
    };

    const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPropertyType(e.target.value);
    };

    const handleUpdate = () => {
        fetchProperties();
    };
    return (
        <>
            <Navbar />
            <div className="w-full h-10 mt-32 flex justify-center items-center">
                <span className="w-1/2">
                    <p className="text-4xl font-bold text-center">Properties</p>
                </span>
            </div>
            <div className="flex w-full h-20 justify-center items-center my-10">
                <div className="flex flex-row w-2/3 h-full bg-slate-300 justify-around items-center rounded-lg">
                    <select className="w-1/3 h-1/2 mx-2 border border-slate-400 rounded-lg"
                        value={location}
                        onChange={handleLocationChange}>
                        <option value="option1">Location</option>
                        {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    <select className="w-1/3 h-1/2 mx-2 border border-slate-400 rounded-lg"
                    value={propertyType}
                    onChange={handlePropertyTypeChange}>
                        <option value="option1">Property Type</option>
                        {PROPERTY_TYPES.map((ptype) => (
                            <option key={ptype} value={ptype}>{ptype}</option>
                        ))}
                    </select>
                    <button className="w-1/3 h-1/2 mx-2 bg-slate-700 text-white rounded-lg"
                        onClick={handleUpdate}>
                        Update
                    </button>
                </div>
            </div>
            <div className="flex w-full h-4 justify-center items-center my-2">
                <div className="flex flex-row w-2/3 justify-start items-center space-x-2">
                    <p className="text-xl">Select: </p>
                    <BlackTag offerType={OfferType.All} onClick={() => setOfferType(OfferType.All)} />
                    <BlackTag offerType={OfferType.ForLease} onClick={() => setOfferType(OfferType.ForLease)} />
                    <BlackTag offerType={OfferType.ForSale} onClick={() => setOfferType(OfferType.ForSale)} />
                    <BlackTag offerType={OfferType.ForSaleOrLease} onClick={() => setOfferType(OfferType.ForSaleOrLease)} />
                    <BlackTag offerType={OfferType.Sold} onClick={() => setOfferType(OfferType.Sold)} />
                </div>
            </div>
            <div className="flex justify-center items-center my-8">
                <div className="grid grid-cols-3 gap-4 w-2/3">
                    {properties.map(property => (
                        <PropertyCard
                            key={property.id}
                            name={property.frontage}
                            imageUrl=""
                            link={`/properties/${property.id}`}
                            offer={property.offer}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
