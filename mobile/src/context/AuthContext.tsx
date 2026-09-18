import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { cacheData, getCachedData, removeCachedData } from '../utils/cache';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  signIn: (token: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  userToken: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-login on app boot
    const bootstrapAsync = async () => {
      try {
        const token = await getCachedData('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.error('Restoring token failed', e);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const signIn = async (token: string, userData: any) => {
    await cacheData('userToken', token);
    await cacheData('userData', userData);
    setUserToken(token);
  };

  const signOut = async () => {
    await removeCachedData('userToken');
    await removeCachedData('userData');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
