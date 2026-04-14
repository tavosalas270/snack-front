import { BadLoginResponse, LoginParams, LoginResponse, SignUpParams, SignUpResponse } from "../interfaces";

export const signUp = async ({ username, email, password }: SignUpParams): Promise<SignUpResponse> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    const response = await fetch(`${baseUrl}/api/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        throw { status: response.status } as BadLoginResponse;
    }

    const data = await response.json();

    return data
};

export const login = async ({ email, username, password }: LoginParams): Promise<LoginResponse> => {
    const baseUrl = process.env.EXPO_PUBLIC_SERVER_URL;
    
    const bodyData: Record<string, string> = { password };
    if (email) bodyData.email = email;
    if (username) bodyData.username = username;

    const response = await fetch(`${baseUrl}/api/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
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
