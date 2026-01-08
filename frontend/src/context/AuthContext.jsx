import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      console.log('🚀 Fetching profile from:', api.defaults.baseURL + 'auth/profile/');
      const response = await api.get('auth/profile/');
      console.log('✅ Profile response:', response.data);
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
    console.log('🔑 Starting login for:', email);
    try {
      const response = await api.post('auth/login/', { email, password });
      console.log('✅ Login successful, tokens received');
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_email', email);
      
      // Set basic user info immediately so ProtectedRoute allows navigation
      setUser({ email });
      
      // Fetch full profile in the background
      console.log('👤 Initiating background profile fetch...');
      api.get('auth/profile/')
        .then(profileRes => {
          console.log('✅ Profile fetched successfully');
          const userData = {
            email,
            full_name: profileRes.data.full_name,
            business_name: profileRes.data.business_name
          };
          localStorage.setItem('user_full_name', userData.full_name || '');
          localStorage.setItem('user_business_name', userData.business_name || '');
          setUser(userData);
        })
        .catch(profileErr => {
          console.error('❌ Background profile fetch failed:', profileErr.message);
          // We already have the email set from earlier
        });
      
      return response.data;
    } catch (loginErr) {
      console.error('❌ Login request failed:', loginErr.message);
      throw loginErr;
    }
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
