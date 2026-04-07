import { LoginParams, LoginResponse } from "../interfaces";


export const signUp = async (email: string, pass: string) => {
    // TODO: Implement API logic
    console.log('Signing up with', email);
    return true;
};

export const login = async ({ email, password }: LoginParams): Promise<LoginResponse> => {
    const baseUrl = process.env.SERVER_URL;
    const response = await fetch(`${baseUrl}/api/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};
