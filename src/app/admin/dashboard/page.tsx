"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Agent from "@/app/models/agent";
import Property from "@/app/models/property";
import PropertyCard from "@/app/components/property_card";
import AgentCard from "@/app/agents/[agentId]/page";
import { fetchAgents, fetchProperties } from "./api/helper";
import axios from "axios";

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const [agentsData, propertiesData] = await Promise.all([
        fetchAgents(),
        fetchProperties(page, itemsPerPage),
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
  };
        // const verifyToken = async () => {
    //   try {
    //     const response = await fetch('/api/verifyToken');

    //     if (!response.ok) {
    //       console.error('Token verification failed, redirecting to login');
    //       throw new Error('Failed to authenticate');
    //     }

    //     // Load data only if token is verified
        
    //   } catch (error) {
    //     console.error('Error during token verification or data fetching:', error);
    //     router.push('/admin/login');
    //   }
  // };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;
  
    try {
      await axios.delete(`/api/properties/`, { data: { id } });
      loadData(currentPage); // Refresh the data after deleting
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };
  

  return (
    <div className="flex h-screen">
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
              <Link href="/admin/add_property">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Add Property
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {properties.map((property) => (
                <div key={property.id} className="border p-4 rounded shadow">
                  <PropertyCard
                    name={property.name}
                    address={property.address}
                    description={property.description}
                    imageUrl={property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : ''}
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
            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 mx-1 ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black"
                  } rounded`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}






