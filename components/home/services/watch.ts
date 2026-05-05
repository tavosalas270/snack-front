import { Favorites, Series } from "../interfaces";

export const getSeries = async (page: number = 1, token: string | null = null): Promise<Series[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/api/series/?page=${page}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getFavorites = async (page: number = 1, token: string | null = null): Promise<Favorites[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/api/favorites/?page=${page}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const addFavorite = async (video: string, token: string | null = null): Promise<Favorites> => {
    console.log("Hola: ", video)
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/api/favorites/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            video: video,
        }),
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};
