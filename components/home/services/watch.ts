import { Series } from "../interfaces";

export const getSeries = async (page: number = 1): Promise<Series[]> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const response = await fetch(`${baseUrl}/api/series/?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw { status: response.status };
    }

    const data = await response.json();

    return data.results;
};
