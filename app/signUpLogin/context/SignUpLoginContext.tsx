import { createContext, useContext, useState, ReactNode } from 'react';

type SubSectionType = 'create' | 'link' | 'code' | null;

interface SignUpLoginContextProps {
  subSectionSelected: SubSectionType;
  setSubSectionSelected: (section: SubSectionType) => void;
}

const SignUpLoginContext = createContext<SignUpLoginContextProps | undefined>(undefined);

export function SignUpLoginProvider({ children }: { children: ReactNode }) {
  const [subSectionSelected, setSubSectionSelected] = useState<SubSectionType>('create');

  return (
    <SignUpLoginContext.Provider value={{ subSectionSelected, setSubSectionSelected }}>
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
