"use client";
import Navbar from "../components/nav";
import PropertyCard from "../components/property_card";
import { BlackTag } from "../components/tag";
import { useEffect, useState } from "react";
import axios from "axios";
import Property, { OfferType } from "../models/property";
import { LOCATIONS, PROPERTY_TYPES } from "../lib/constants";
import Footer from "../components/footer";
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function Page() {
  const [offerType, setOfferType] = useState<OfferType>(OfferType.All);
  const [location, setLocation] = useState<string>("option1");
  const [propertyType, setPropertyType] = useState<string>("option1");
  const [searchParams, setSearchParams] = useState({
    location: "option1",
    propertyType: "option1",
    offerType: OfferType.All,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 9;

  // Build query string for SWR
  const queryString = () => {
    const params = new URLSearchParams();
    if (searchParams.location !== "option1") params.append("location", searchParams.location);
    if (searchParams.propertyType !== "option1") params.append("type", searchParams.propertyType);
    if (searchParams.offerType !== OfferType.All) params.append("offerType", searchParams.offerType);
    params.append("page", String(currentPage));
    params.append("limit", String(itemsPerPage));
    return `/api/properties/?${params.toString()}`;
  };

  const { data, error, isLoading } = useSWR(queryString(), fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data && data.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

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

  const handleReset = () => {
    setLocation("option1");
    setPropertyType("option1");
    setOfferType(OfferType.All);
    setSearchParams({
      location: "option1",
      propertyType: "option1",
      offerType: OfferType.All,
    });
    setCurrentPage(1);
  };

  if (error) return <div>Error loading properties</div>;
  if (isLoading || !data || !data.properties) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  const properties = data.properties;

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
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Location</label>
              <select
                className="w-full h-11 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700"
                value={location}
                onChange={handleLocationChange}
              >
                <option value="option1">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Property Type</label>
              <select
                className="w-full h-11 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700"
                value={propertyType}
                onChange={handlePropertyTypeChange}
              >
                <option value="option1">All Types</option>
                {PROPERTY_TYPES.map((ptype) => (
                  <option key={ptype} value={ptype}>{ptype}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Offer Type</label>
              <select
                className="w-full h-11 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700"
                value={offerType}
                onChange={(e) => handleOfferTypeChange(e.target.value as OfferType)}
              >
                <option value={OfferType.All}>All Offers</option>
                <option value={OfferType.ForSale}>For Sale</option>
                <option value={OfferType.ForLease}>For Lease</option>
                <option value={OfferType.ForSaleOrLease}>For Sale or Lease</option>
                <option value={OfferType.Sold}>Sold</option>
              </select>
            </div>
            
            <div className="md:col-span-2 lg:col-span-1">
              <button
                className="w-full h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                onClick={handleUpdate}
              > 
                Search
              </button>
            </div>
            
            <div className="md:col-span-2 lg:col-span-1">
              <button
                className="w-full h-11 bg-transparent text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm border border-gray-300"
                onClick={handleReset}
              > 
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-16">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Properties Found</h3>
            <p className="text-gray-500 mb-6">
              No properties match your current filters. Try adjusting your search criteria or reset the filters.
            </p>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center my-8">
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
              {properties.map((property: Property) => (
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
        </>
      )}
      <Footer />
    </>
  );
}
