import { createContext, ReactNode, useContext, useState } from 'react';

interface LoginContextProps {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    refreshToken: string | null;
    setRefreshToken: (token: string) => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export function LoginProvider({ children }: { children: ReactNode }) {

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    return (
        <LoginContext.Provider value={{
            accessToken, setAccessToken,
            refreshToken, setRefreshToken
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
