import axios from 'axios';

export async function fetchAgents() {
    
    const response = await axios.get('/api/agents/');
    return response.data;
}

export async function fetchProperties() {
    const response = await axios.get('/api/properties/');
    return response.data;
}
