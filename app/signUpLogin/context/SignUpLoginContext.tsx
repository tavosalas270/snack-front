import { createContext, useContext, useState, ReactNode } from 'react';

type SubSectionType = 'create' | 'link' | 'code' | null;

export interface LinkEmailData {
  email: string;
  acceptedTerms: boolean;
}

export interface VerifyCodeData {
  code: string[];
}

interface SignUpLoginContextProps {
  subSectionSelected: SubSectionType;
  setSubSectionSelected: (section: SubSectionType) => void;
  linkEmailData: LinkEmailData;
  setLinkEmailData: (data: LinkEmailData) => void;
  verifyCodeData: VerifyCodeData;
  setVerifyCodeData: (data: VerifyCodeData) => void;
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

  return (
    <SignUpLoginContext.Provider value={{
      subSectionSelected, setSubSectionSelected,
      linkEmailData, setLinkEmailData,
      verifyCodeData, setVerifyCodeData
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
