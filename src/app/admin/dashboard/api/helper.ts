import axios from 'axios';

export async function fetchAgents() {
    
    const response = await axios.get('/api/agents/');
    return response.data;
}

export async function fetchProperties(page: number, limit: number, searchParams?: any) {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    
    if (searchParams) {
        if (searchParams.location !== "option1") params.append("location", searchParams.location);
        if (searchParams.propertyType !== "option1") params.append("type", searchParams.propertyType);
        if (searchParams.offerType !== "All") params.append("offerType", searchParams.offerType);
    }
    
    const response = await axios.get(`/api/properties/?${params.toString()}`);
    return response.data;
  }
