import { Videos } from "../interfaces";

export const getVideos = async (page: number = 1, serie: number): Promise<Videos[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const response = await fetch(`${baseUrl}/api/videos/?page=${page}&serie=${serie}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const searchVideos = async (query: string, category?: string): Promise<Videos[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    let url = `${baseUrl}/api/videos/?`;
    if (query) {
        url += `search=${encodeURIComponent(query)}&`;
    }
    if (category) {
        url += `category=${encodeURIComponent(category)}`;
    }
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};