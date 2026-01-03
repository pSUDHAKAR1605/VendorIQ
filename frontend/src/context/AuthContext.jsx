import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ 
        email: localStorage.getItem('user_email'),
        full_name: localStorage.getItem('user_full_name'),
        business_name: localStorage.getItem('user_business_name')
      });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('auth/login/', { email, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user_email', email);
    
    // Fetch profile to get business name and full name
    try {
      const profileRes = await api.get('auth/profile/');
      const userData = {
        email,
        full_name: profileRes.data.full_name,
        business_name: profileRes.data.business_name
      };
      localStorage.setItem('user_full_name', userData.full_name);
      localStorage.setItem('user_business_name', userData.business_name);
      setUser(userData);
    } catch (profileErr) {
      console.error('Error fetching profile:', profileErr);
      setUser({ email });
    }
    
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('auth/register/', userData);
    // After registration, we have the user data
    localStorage.setItem('user_full_name', userData.full_name);
    localStorage.setItem('user_business_name', userData.business_name);
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
