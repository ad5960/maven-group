import Agent from "../models/agent";
import Property from "../models/property";

export async function callGetAgents() {
    const response = await fetch('/api/agents', {
        method: 'GET'
    });
    return response.json();
}

export async function callGetAgentById(id: string) {
    const response = await fetch(`/api/agents/${id}`, {
        method: 'GET'
    });
    return response.json();
}

export async function callPostAgent(agentData: Agent) {
    const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentData)
    });
    return response.json();
}

export async function callGetProperties() {
    const response = await fetch('/api/properties', {
        method: 'GET'
    });
    return response.json();
}

export async function callGetPropertyById(id: string) {
    const response = await fetch(`/api/properties/${id}`, {
        method: 'GET'
    });
    return response.json();
}

export async function callPostProperty(propertyData: Property) {
    const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
    });
    return response.json();
}
