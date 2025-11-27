import { createContext, useContext, useState, ReactNode } from 'react';
import { Account } from '../lib/supabase';

interface AuthContextType {
  account: Account | null;
  login: (account: Account) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);

  const login = (account: Account) => {
    setAccount(account);
  };

  const logout = () => {
    setAccount(null);
  };

  return (
    <AuthContext.Provider value={{ account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
