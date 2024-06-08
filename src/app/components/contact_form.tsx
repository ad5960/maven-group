"use client"
import { useEffect, useState } from "react";
import AgentCard from "../agents/[agentId]/page";
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import Agent from "../models/agent";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function ContactForm() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const pathname = usePathname();

    useEffect(() => {
        async function fetchAgents() {
            try {
                console.log("Fetching agents...");
                const res = await axios.get("/agents/api");
                setAgents(res.data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (e) {
                console.error("Error fetching agents: ", e);
                setLoading(false); // Set loading to false even if there is an error
            }
        }

        fetchAgents();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full">Loading...</div>; // Show a loading spinner or any loading indicator
    }

    const agentId = agents[0].id;
    console.log("AgentID: ", agentId);

    const isContactUsPage = (pathname === '/contact_us')
    return (
        <div className="flex flex-col w-full max-w-lg mx-auto h-[75vh] border border-slate-400 rounded-lg p-4 md:w-2/3 lg:w-1/2">
            <p className="mb-4 font-bold text-2xl text-center md:text-left">Contact an agent</p>

            {!isContactUsPage && <AgentCard params={{ agentId }} />}

            <p className="mb-4 font-bold text-center md:text-left">Send a Message</p>
            <div className="space-y-4">
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="name-input">Full Name</InputLabel>
                    <OutlinedInput id="name-input" label="Full Name" />
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
                    <OutlinedInput id="phone-input" label="Phone Number" />
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="email-input">Email Address</InputLabel>
                    <OutlinedInput id="email-input" label="Email Address" />
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="msg-input">Message</InputLabel>
                    <OutlinedInput id="msg-input" label="Message" minRows={4} multiline />
                </FormControl>
            </div>
        </div>
    );
}
