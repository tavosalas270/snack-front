import { createContext, ReactNode, useContext, useState } from 'react';
import { LinkEmailData, SetCredentialsData, SubSectionType, VerifyCodeData } from '../interfaces';

interface SignUpLoginContextProps {
  tabSelected: 'login' | 'sign';
  setTabSelected: (tab: 'login' | 'sign') => void;
  subSectionSelected: SubSectionType;
  setSubSectionSelected: (section: SubSectionType) => void;
  linkEmailData: LinkEmailData;
  setLinkEmailData: (data: LinkEmailData) => void;
  verifyCodeData: VerifyCodeData;
  setVerifyCodeData: (data: VerifyCodeData) => void;
  setCredentialsData: SetCredentialsData;
  setSetCredentialsData: (data: SetCredentialsData) => void;
}

const SignUpLoginContext = createContext<SignUpLoginContextProps | undefined>(undefined);

export function SignUpLoginProvider({ children }: { children: ReactNode }) {
  const [tabSelected, setTabSelected] = useState<'login' | 'sign'>('login');
  const [subSectionSelected, setSubSectionSelected] = useState<SubSectionType>('create');
  const [linkEmailData, setLinkEmailData] = useState<LinkEmailData>({
    email: '',
    acceptedTerms: false,
  });
  const [verifyCodeData, setVerifyCodeData] = useState<VerifyCodeData>({
    code: ['', '', '', '', ''],
  });
  const [setCredentialsData, setSetCredentialsData] = useState<SetCredentialsData>({
    username: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <SignUpLoginContext.Provider value={{
      tabSelected, setTabSelected,
      subSectionSelected, setSubSectionSelected,
      linkEmailData, setLinkEmailData,
      verifyCodeData, setVerifyCodeData,
      setCredentialsData, setSetCredentialsData,
    }}>
      {children}
    </SignUpLoginContext.Provider>
  );
}

export function useSignUpContext() {
  const context = useContext(SignUpLoginContext);
  if (context === undefined) {
    throw new Error('useSignUpContext must be used within a SignUpProvider');
  }
  return context;
}
