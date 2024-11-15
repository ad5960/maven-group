import axios from 'axios';

export async function fetchAgents() {
    
    const response = await axios.get('/api/agents/');
    return response.data;
}

export async function fetchProperties(page: number, limit: number) {
    const response = await axios.get(`/api/properties/?page=${page}&limit=${limit}`);
    return response.data;
  }
