import { createContext, ReactNode, useContext, useState } from 'react';
import { LinkEmailData, SubSectionType, VerifyCodeData } from '../interfaces';

interface SignUpLoginContextProps {
  subSectionSelected: SubSectionType;
  setSubSectionSelected: (section: SubSectionType) => void;
  linkEmailData: LinkEmailData;
  setLinkEmailData: (data: LinkEmailData) => void;
  verifyCodeData: VerifyCodeData;
  setVerifyCodeData: (data: VerifyCodeData) => void;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string) => void;
}

const SignUpLoginContext = createContext<SignUpLoginContextProps | undefined>(undefined);

export function SignUpLoginProvider({ children }: { children: ReactNode }) {
  const [subSectionSelected, setSubSectionSelected] = useState<SubSectionType>('create');
  const [linkEmailData, setLinkEmailData] = useState<LinkEmailData>({
    email: '',
    acceptedTerms: false,
  });
  const [verifyCodeData, setVerifyCodeData] = useState<VerifyCodeData>({
    code: ['', '', '', '', ''],
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  return (
    <SignUpLoginContext.Provider value={{
      subSectionSelected, setSubSectionSelected,
      linkEmailData, setLinkEmailData,
      verifyCodeData, setVerifyCodeData,
      accessToken, setAccessToken,
      refreshToken, setRefreshToken
    }}>
      {children}
    </SignUpLoginContext.Provider>
  );
}

export function useSignUpLoginContext() {
  const context = useContext(SignUpLoginContext);
  if (context === undefined) {
    throw new Error('useSignUpLoginContext must be used within a SignUpLoginProvider');
  }
  return context;
}
