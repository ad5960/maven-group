'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Agent from '@/app/models/agent';
import Property from '@/app/models/property';
import PropertyCard from '@/app/components/property_card';
import AgentCard from '@/app/agents/[agentId]/page';
import { fetchAgents, fetchProperties } from './api/helper';

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verifyToken');

        if (!response.ok) {
          console.error('Token verification failed, redirecting to login');
          throw new Error('Failed to authenticate');
        }

        // Load data only if token is verified
        const loadData = async () => {
          try {
            const [agentsData, propertiesData] = await Promise.all([
              fetchAgents(),
              fetchProperties(),
            ]);
            setAgents(agentsData);
            setProperties(propertiesData);
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false); // Stop loading after data is fetched
          }
        };
        loadData();
      } catch (error) {
        console.error('Error during token verification or data fetching:', error);
        router.push('/admin/login');
      }
    };

    verifyToken();
  }, [router]);

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
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Add Agent</button>
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Add Property</button>
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  name={property.name}
                  address = {property.address}
                  description={property.description}
                  imageUrl=""
                  link={`/properties/${property.id}`}
                  offer={property.offer}
                  price={''}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
