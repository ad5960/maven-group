"use client"
import { useEffect, useState } from 'react';
import { fetchAgents, fetchProperties } from './api/helper';
import { List, ListItem, ListItemText, Divider, Typography, Box, Button } from '@mui/material';
import Agent from '@/app/models/agent';
import Property from '@/app/models/property';
import { useRouter } from "next/navigation"
import PropertyCard from '@/app/components/property_card';
import Link from 'next/link';
import AgentCard from '@/app/agents/[agentId]/page';

export default function Page() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            const agentsData = await fetchAgents();
            const propertiesData = await fetchProperties();
            setAgents(agentsData);
            setProperties(propertiesData);
        }
        loadData();
    }, []);

    const handleAddAgent = () => {
        router.push("/admin/add_agent");
    } 

    const handleAddProperty = () => {
        router.push("/admin/add_property");
    } 
    return (
        <div className="flex h-screen">
            <div className="w-1/4 p-4 border-r border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Agents</h2>
                    <Link href="/admin/add-agent">
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
                    <Link href="/admin/add-property">
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
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
