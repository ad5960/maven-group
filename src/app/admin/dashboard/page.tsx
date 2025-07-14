"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Agent from "@/app/models/agent";
import Property from "@/app/models/property";
import PropertyCard from "@/app/components/property_card";
import AgentCard from "@/app/agents/[agentId]/page";
import { fetchAgents, fetchProperties } from "./api/helper";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { LOCATIONS, PROPERTY_TYPES } from "@/app/lib/constants";
import { OfferType } from "@/app/models/property";

const ADMIN_EMAIL = "mavianchris@gmail.com";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  // Filter states
  const [location, setLocation] = useState<string>("option1");
  const [propertyType, setPropertyType] = useState<string>("option1");
  const [offerType, setOfferType] = useState<OfferType>(OfferType.All);
  const [searchParams, setSearchParams] = useState({
    location: "option1",
    propertyType: "option1",
    offerType: OfferType.All,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        logout();
        router.push("/admin/login");
      }
    }
  }, [user, authLoading, router, logout]);

  const loadData = useCallback(async (page: number) => {
    if (!user) return;
    setLoading(true);
    try {
      const [agentsData, propertiesData] = await Promise.all([
        fetchAgents(),
        fetchProperties(page, itemsPerPage, searchParams),
      ]);
      setAgents(agentsData);
      setProperties(propertiesData.properties || []);
      setTotalPages(propertiesData.totalPages || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [user, itemsPerPage, searchParams]);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage, loadData]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
  };

  const handleOfferTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOfferType(e.target.value as OfferType);
  };

  const handleUpdate = () => {
    setSearchParams({
      location,
      propertyType,
      offerType,
    });
    setCurrentPage(1);
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

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    try {
      await axios.delete("/api/properties", { data: { id } });
      loadData(currentPage);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  // Show auth loading state if auth is still being determined
  if (authLoading) {
    return <div>Loading auth state...</div>;
  }

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="absolute top-4 right-4 flex space-x-4">
        <Link href="/admin/add_property">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Add Property
          </button>
        </Link>
        <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Logout
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <div className="w-1/4 p-4 border-r border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Agents</h2>
              <Link href="/admin/add_agent">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Add Agent
                </button>
              </Link>
            </div>
            <div className="space-y-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} params={{ agentId: agent.id }} />
              ))}
            </div>
          </div>

          <div className="w-1/8 bg-gray-200"></div> {/* Dividing line */}

          <div className="w-3/4 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Properties</h2>
            </div>

            {/* Filter Section */}
            <div className="mb-6">
              <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 shadow-xl rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Filter Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Location</label>
                    <select
                      className="w-full h-10 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700"
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
                      className="w-full h-10 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700"
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
                      className="w-full h-10 px-3 border-0 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-gray-700"
                      value={offerType}
                      onChange={handleOfferTypeChange}
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
                      className="w-full h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                      onClick={handleUpdate}
                    > 
                      Search
                    </button>
                  </div>
                  
                  <div className="md:col-span-2 lg:col-span-1">
                    <button
                      className="w-full h-10 bg-transparent text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm border border-gray-300"
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
                <div className="grid grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border p-4 rounded shadow">
                      <PropertyCard
                        name={property.name}
                        address={property.address}
                        escrow={property.escrow}
                        description={property.description}
                        imageUrl={property.imageUrls?.length ? property.imageUrls[0] : ""}
                        link={`/properties/${property.id}`}
                        offer={property.offer}
                        price={""}
                      />
                      <div className="mt-2 flex justify-between">
                        <Link href={`/admin/update_property/${property.id}`}>
                          <button className="px-4 py-2 bg-yellow-500 text-white rounded">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6">
                    <div className="flex space-x-2 mb-6">
                      <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          className={`px-3 py-1 rounded ${
                            currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
