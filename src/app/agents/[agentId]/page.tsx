"use client"
import Image from "next/image"
import LANight from "../../assets/LANight.jpg"
import Agent from "@/app/models/agent"
import { useEffect, useState } from "react"
import axios from "axios";

export default function AgentCard({params}: {params: {agentId: string}}) {
    const id = params.agentId;
    const [agent, setAgent] = useState<Agent>();

    useEffect(() => {
        async function fetchAgent() {
            if (id) {
                const res = await axios.get(`/agents/${id}/api`);
                setAgent(res.data)
            }
            
      }

      fetchAgent()
    }, [id])

    if (!agent) {
        return <div>Loading...</div>;
    }
    
    console.log(agent)

    return (<>
        <div className="flex flex-row w-full h-[100px]">
            <div className="flex flex-basis-1/4 w-1/4 mx-2 my-2">
                <Image src={LANight} alt="Agent Photo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col mx-2 my-2">
                { agent ? (<>
                <p className="font-bold">{agent.name}</p>
                <p className="text-sm">{agent.email}</p>
                <p className="text-sm">{agent.phoneNumber}</p>
                <p className="text-sm">{agent.licenseNumber}</p>
                </>): (<>
                    <p className="font-bold">{"Christopher Mavian"}</p>
                    <p className="text-sm">{ "chris@mavengroups.com"}</p>
                    <p className="text-sm">{"+1 (818) xxx-2193"}</p>
                    <p className="text-sm">{"LIC20135"}</p>
                </>)}
            </div>
        </div>
    </>)
}