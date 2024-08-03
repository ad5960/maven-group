"use client"
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/nav";
import Beach from "./assets/beach.jpg"
import Footer from "./components/footer";
import { useEffect, useState } from "react";
import Property from "./models/property";
import axios from "axios";
import PropertyCard from "./components/property_card";

export default function Page() {


  const [properties, setProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/properties/", {
          params: {
            limit: 5
          }
        });
        console.log("Response data:", res.data);
        setProperties(res.data);
        localStorage.setItem('properties', JSON.stringify(res.data)); // Store in local storage
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    // Check if properties are already in local storage
    const cachedProperties = localStorage.getItem('properties');
    if (cachedProperties) {
      console.log("found in cache")
      setProperties(JSON.parse(cachedProperties));
    } else {
      console.log("not found in cache")
      fetchProperties();
    }
  }, []);


  return (
    <div className="relative">
      <Navbar />
      <div className="w-full h-screen relative">
        <Image src={Beach} alt="Los Angeles Night" layout="fill" objectFit="cover" className="filter brightness-75" />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-white text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">maven</span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">: noun</span>
            <br />
            <span className="text-lg sm:text-2xl md:text-2xl lg:text-3xl typing-effect-maven">ma-ven</span>
            <br />
            <span className="text-sm sm:text-md md:text-base lg:text-2xl typing-effect">: One who is experienced or knowledgeable: EXPERT</span>
          </p>
        </div>
      </div>
      <div className=" flex justify-center items-center text-3xl mt-10 font-semibold">
        <h1>Properties</h1>
      </div>
      <div className="flex justify-center items-center mt-10">
        
                <div className=" py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
                    {properties.map(property => (

                        
                        <PropertyCard
                            key={property.id}
                            name={property.frontage}
                            imageUrl={property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : ''}
                            link={`/properties/${property.id}`}
                            offer={property.offer}
                            price={property.offer === "For Sale" || property.offer === "Sold" ? property.askingPrice : property.offer === "For Lease" ? property.pricePerSF : property.askingPrice + " or " + property.pricePerSF}
                        />
                    ))}
        </div>
      </div>
      <div className="flex justify-center mb-10">
      <div className="cente">
          <Link href="/properties">
            <button className="btn">
    <svg width="180px" height="60px" viewBox="0 0 180 60" className="border button-svg">
      <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
      <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
    </svg>
    <span>View More</span>
          </button>
          </Link>
</div>
      </div>
      <Footer />
    </div>
  );
}