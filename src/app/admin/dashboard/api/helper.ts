import axios from 'axios';

export async function fetchAgents() {
    const response = await axios.get('/agents/api');
    return response.data;
}

export async function fetchProperties() {
    const response = await axios.get('/properties/api');
    return response.data;
}
