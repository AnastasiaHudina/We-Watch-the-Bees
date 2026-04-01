import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

// Типы для пользователя
interface User {
  id: number;
  username: string;
  email: string;
}

// Типы для контекста
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (userData: { username: string; email: string; password1: string; password2: string }) => Promise<{ success: boolean; errors?: any }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Загрузка текущего пользователя при монтировании
  useEffect(() => {
    api.get('/user/')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await api.post('/login/', { username, password });
      if (res.data.success) {
        const userRes = await api.get('/user/');
        setUser(userRes.data);
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.error || 'Ошибка соединения' };
    }
  };

  const logout = async () => {
    await api.post('/logout/');
    setUser(null);
  };

  const register = async (userData: { username: string; email: string; password1: string; password2: string }) => {
    try {
      const res = await api.post('/register/', userData);
      if (res.data.success) {
        const userRes = await api.get('/user/');
        setUser(userRes.data);
        return { success: true };
      }
      return { success: false, errors: res.data.errors };
    } catch (err: any) {
      return { success: false, errors: err.response?.data?.errors || 'Ошибка регистрации' };
    }
  };

  const value = { user, loading, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};