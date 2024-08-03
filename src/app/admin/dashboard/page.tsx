"use client";

import { useEffect, useState } from 'react';
import { fetchAgents, fetchProperties } from './api/helper';
import { useRouter } from 'next/navigation';
import Agent from '@/app/models/agent';
import Property from '@/app/models/property';
import PropertyCard from '@/app/components/property_card';
import AgentCard from '@/app/agents/[agentId]/page';
import { useCookies } from 'next-client-cookies';
import { jwtVerify } from 'jose';
import Link from 'next/link';


export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
    const router = useRouter();
    const cookies = useCookies();
 

    useEffect(() => {
        const token = cookies.get('authToken');
        console.log('Cookie token:', token); // Debugging
    
        if (!token) {
          console.log('Token not found or undefined:', token);
          router.push('/admin/login');
          return;
        }
        const secretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

        if (!secretKey) {
          throw new Error('JWT secret is not defined in environment variables');
        }

        const verifyToken = async () => {
            try {
              const { payload } = await jwtVerify(token, secretKey, {
                algorithms: ['HS256'], // Specify the expected algorithm
              });
      
              // Load data only if token is valid
              const loadData = async () => {
                const agentsData = await fetchAgents();
                const propertiesData = await fetchProperties();
                setAgents(agentsData);
                setProperties(propertiesData);
              };
              loadData();
            } catch (error:any) {
              console.error('Token verification failed:', error.message);
              router.push('/admin/login');
            }
          };
      
          verifyToken();
        }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 border-r border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Agents</h2>
          <Link href="/admin/add_agent">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Add Agent</button>
          </Link>
        </div>
        <div className="space-y-4">
          {agents.map(agent => (
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
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              name={property.frontage}
              imageUrl=""
              link={`/properties/${property.id}`}
              offer={property.offer}
              price={''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
