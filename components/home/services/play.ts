import { Comments, PostComment, Videos } from "../interfaces";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const getVideos = async (page: number = 1, serie: number, token: string | null = null): Promise<Videos[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/videos/?page=${page}&serie=${serie}`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};


export const getPurchases = async (token: string): Promise<Videos[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/videos/my-purchases/`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const searchVideos = async (query: string, category?: string, token: string | null = null): Promise<Videos[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    let url = `${baseUrl}/api/videos/?`;
    if (query) {
        url += `search=${encodeURIComponent(query)}&`;
    }
    if (category) {
        url += `category=${encodeURIComponent(category)}`;
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(url, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const postPayVideo = async (videoId: string, token: string | null = null): Promise<any> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/videos/${videoId}/unlock/`, {
        method: 'POST',
        headers,
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getComments = async (videoId: string, token: string | null = null): Promise<Comments[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/comments/?video_id=${videoId}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};

export const getVideoPlayUrl = async (videoId: string, token: string | null = null): Promise<{ videoUrl: string }> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;

    // expo-video maneja la autenticación con el header Authorization directamente.
    // Si hay un error de acceso (401/403), el listener 'statusChange' en el player lo captura.
    return {
        videoUrl: `${baseUrl}/api/videos/${videoId}/play/`,
    };
};


export const postCommentService = async (comment: PostComment, token: string | null = null): Promise<Comments> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const response = await fetchWithAuth(`${baseUrl}/api/comments/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(comment)
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();
    return data;
};