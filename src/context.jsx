import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('soniq_access_token'));
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('soniq_user_profile')); } catch { return null; }
  });

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
    const { accessToken, profile: p } = data;
    localStorage.setItem('soniq_access_token', accessToken);
    if (p) localStorage.setItem('soniq_user_profile', JSON.stringify(p));
    setToken(accessToken);
    setProfile(p ?? null);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('soniq_access_token');
    localStorage.removeItem('soniq_user_profile');
    setToken(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, profile, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
