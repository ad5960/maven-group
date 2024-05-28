"use client"
import { useEffect, useState } from 'react';
import { fetchAgents, fetchProperties } from './api/helper';
import { List, ListItem, ListItemText, Divider, Typography, Box, Button } from '@mui/material';
import Agent from '@/app/models/agent';
import Property from '@/app/models/property';
import { useRouter } from "next/navigation"

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
        <Box display="flex" height="100vh">
            {/* Sidebar */}
            <Box width="250px" bgcolor="grey.200" p={2}>
                <Typography variant="h6" gutterBottom>
                    Agents
                </Typography>
                <Button variant="contained" color="primary" onClick={handleAddAgent} fullWidth>
                    Add Agent
                </Button>
                <List>
                    { agents ? agents.map(agent => (
                        <div key={agent.id}>
                            <ListItem button>
                                <ListItemText primary={agent.name} />
                            </ListItem>
                            <Divider />
                        </div>
                    )) : (<></>)}
                </List>
            </Box>

            {/* Main content */}
            <Box flex="1" p={2}>
                <Typography variant="h6" gutterBottom>
                    Properties
                </Typography>
                <Button variant="contained" color="primary" onClick={handleAddProperty} >
                    Add Property
                </Button>
                <List>
                    {properties ? properties.map(property => (
                        <div key={property.id}>
                            <ListItem button>
                                <ListItemText primary={property.frontage} secondary={property.address.street} />
                            </ListItem>
                            <Divider />
                        </div>
                    )) : (<></>)}
                </List>
            </Box>
        </Box>
    );
}
