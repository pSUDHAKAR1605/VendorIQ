import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get('auth/profile/');
      const userData = {
        email: response.data.email,
        full_name: response.data.full_name,
        business_name: response.data.business_name
      };
      localStorage.setItem('user_email', userData.email);
      localStorage.setItem('user_full_name', userData.full_name);
      localStorage.setItem('user_business_name', userData.business_name);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // If profile fetch fails, we might have an invalid token
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // First set what we have in localStorage for immediate UI update
        setUser({ 
          email: localStorage.getItem('user_email'),
          full_name: localStorage.getItem('user_full_name'),
          business_name: localStorage.getItem('user_business_name')
        });
        // Then fetch fresh data from server
        await fetchProfile();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('auth/login/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Fetch profile immediately after login
    await fetchProfile();
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('auth/register/', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_full_name');
    localStorage.removeItem('user_business_name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
