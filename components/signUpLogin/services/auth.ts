import { BadLoginResponse, LoginParams, LoginResponse } from "../interfaces";

export const signUp = async (email: string, pass: string) => {
    // TODO: Implement API logic
    console.log('Signing up with', email);
    return true;
};

export const login = async ({ email, password }: LoginParams): Promise<LoginResponse> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const response = await fetch(`${baseUrl}/api/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw { status: response.status } as BadLoginResponse;
    }

    const data = await response.json();

    return {
        token: data,
        status: response.status
    }
};
