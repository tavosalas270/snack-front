import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

interface LoginContextProps {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    refreshToken: string | null;
    setRefreshToken: (token: string | null) => void;
    isLoadingAuth: boolean;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        async function loadTokens() {
            try {
                const storedAccessToken = await SecureStore.getItemAsync('accessToken');
                const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
                if (storedAccessToken) setAccessTokenState(storedAccessToken);
                if (storedRefreshToken) setRefreshTokenState(storedRefreshToken);
            } catch (error) {
                console.error("Error loading tokens", error);
            } finally {
                setIsLoadingAuth(false);
            }
        }
        loadTokens();

        // Escuchar eventos globales del interceptor de peticiones (fetchWithAuth)
        const sub1 = DeviceEventEmitter.addListener('onTokenRefresh', (tokens: { access: string; refresh?: string }) => {
            setAccessTokenState(tokens.access);
            if (tokens.refresh) {
                setRefreshTokenState(tokens.refresh);
            }
        });
        const sub2 = DeviceEventEmitter.addListener('onLogout', () => {
            setAccessTokenState(null);
            setRefreshTokenState(null);
        });

        return () => {
            sub1.remove();
            sub2.remove();
        };
    }, []);

    const setAccessToken = async (token: string | null) => {
        setAccessTokenState(token);
        if (token) {
            await SecureStore.setItemAsync('accessToken', token);
        } else {
            await SecureStore.deleteItemAsync('accessToken');
        }
    };

    const setRefreshToken = async (token: string | null) => {
        setRefreshTokenState(token);
        if (token) {
            await SecureStore.setItemAsync('refreshToken', token);
        } else {
            await SecureStore.deleteItemAsync('refreshToken');
        }
    };

    return (
        <LoginContext.Provider value={{
            accessToken, setAccessToken,
            refreshToken, setRefreshToken,
            isLoadingAuth
        }}>
            {children}
        </LoginContext.Provider>
    );
}

export function useLoginContext() {
    const context = useContext(LoginContext);
    if (context === undefined) {
        throw new Error('useLoginContext must be used within a LoginProvider');
    }
    return context;
}
