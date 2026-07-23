import { AddFavoriteResponse, Categories, Favorites, LikeVideoResponse, Series, UserTokenData } from "../interfaces";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const getUserTokenData = async (token: string | null = null): Promise<UserTokenData> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/users/me/`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getSeries = async (page: number = 1, token: string | null = null): Promise<Series[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/series/?page=${page}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getCategories = async (): Promise<Categories[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const response = await fetch(`${baseUrl}/api/categories/`, {
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

export const getFavorites = async (page: number = 1, token: string | null = null): Promise<Favorites[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/favorites/?page=${page}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const addFavorite = async (video: string, token: string | null = null): Promise<AddFavoriteResponse> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/favorites/`, {
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

export const postLikeVideo = async (videoId: string, token: string | null = null): Promise<LikeVideoResponse> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/video-interactions/toggle-like/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            video_id: videoId,
        }),
    });

    if (!response.ok) {
        throw { status: response.status };
    }
    const data = await response.json();
    return data;
};
