import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
const TOKEN_STORAGE_KEY = 'adminToken';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user || null);
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post(
      '/auth/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!data?.token || !data?.user) {
      throw new Error('Invalid login response from server');
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      isAuthLoading,
      isAuthenticated: Boolean(user),
      tokenStorageKey: TOKEN_STORAGE_KEY,
    }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
