"use client";
import Navbar from "../components/nav";
import PropertyCard from "../components/property_card";
import { BlackTag } from "../components/tag";
import { useEffect, useState } from "react";
import axios from "axios";
import Property, { OfferType } from "../models/property";
import { LOCATIONS, PROPERTY_TYPES } from "../lib/constants";
import Footer from "../components/footer";

export default function Page() {
  const [offerType, setOfferType] = useState<OfferType>(OfferType.All);
  const [location, setLocation] = useState<string>("option1");
  const [propertyType, setPropertyType] = useState<string>("option1");
  const [searchParams, setSearchParams] = useState({
    location: "option1",
    propertyType: "option1",
    offerType: OfferType.All,
  });

  const [properties, setProperties] = useState<Property[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.get("/api/properties/", {
          params: {
            location: searchParams.location === "option1" ? undefined : searchParams.location,
            type: searchParams.propertyType === "option1" ? undefined : searchParams.propertyType,
            offerType: searchParams.offerType === OfferType.All ? undefined : searchParams.offerType,
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        if (isMounted) {
          setProperties(res.data.properties);
          setTotalPages(res.data.totalPages);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    // Fetch properties immediately
    fetchProperties();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentPage]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  const handleUpdate = () => {
    setSearchParams({
      location,
      propertyType,
      offerType,
    });
    setCurrentPage(1); // Reset to first page when search parameters change
  };

  const handleOfferTypeChange = (newOfferType: OfferType) => {
    setOfferType(newOfferType);
    setSearchParams({
      location,
      propertyType,
      offerType: newOfferType,
    });
    setCurrentPage(1); // Reset to first page when offer type changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) return <div>Error loading properties</div>;
  if (isLoading || !properties) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="w-full h-10 mt-32 flex justify-center items-center">
        <span className="w-11/12 md:w-1/2">
          <p className="text-2xl md:text-4xl font-bold text-center">Properties</p>
        </span>
      </div>
      <div className="flex w-full justify-center items-center my-10">
        <div className="flex flex-col lg:flex-row w-full lg:w-2/3 bg-slate-300 justify-around items-center rounded-lg p-2">
          <select
            className="w-full lg:w-1/3 h-10 mx-2 my-2 lg:my-0 border border-slate-400 rounded-lg"
            value={location}
            onChange={handleLocationChange}
          >
            <option value="option1">Location</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            className="w-full lg:w-1/3 h-10 mx-2 my-2 lg:my-0 border border-slate-400 rounded-lg"
            value={propertyType}
            onChange={handlePropertyTypeChange}
          >
            <option value="option1">Property Type</option>
            {PROPERTY_TYPES.map((ptype) => (
              <option key={ptype} value={ptype}>{ptype}</option>
            ))}
          </select>
          <button
            className="w-full lg:w-1/3 h-10 mx-2 my-2 lg:my-0 bg-slate-700 text-white rounded-lg"
            onClick={handleUpdate}
          > Update
          </button>
        </div>
      </div>
      <div className="flex w-full justify-center items-center my-2">
        <div className="flex flex-col md:flex-row w-11/12 md:w-2/3 justify-start items-center space-y-2 md:space-y-0 md:space-x-2">
          <p className="text-lg md:text-xl">Select: </p>
          <BlackTag offerType={OfferType.All} onClick={() => handleOfferTypeChange(OfferType.All)} />
          <BlackTag offerType={OfferType.ForLease} onClick={() => handleOfferTypeChange(OfferType.ForLease)} />
          <BlackTag offerType={OfferType.ForSale} onClick={() => handleOfferTypeChange(OfferType.ForSale)} />
          <BlackTag offerType={OfferType.ForSaleOrLease} onClick={() => handleOfferTypeChange(OfferType.ForSaleOrLease)} />
          <BlackTag offerType={OfferType.Sold} onClick={() => handleOfferTypeChange(OfferType.Sold)} />
        </div>
      </div>
      <div className="flex justify-center items-center my-8">
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
          {properties.map((property: Property) => (
            <PropertyCard
              key={property.id}
              name={property.name}
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
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="px-3 py-1 bg-gray-200 rounded"
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
