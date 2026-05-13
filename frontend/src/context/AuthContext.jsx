import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });

  // Sync user from server on mount
  useEffect(() => {
    const syncProfile = async () => {
      if (user?.token) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const { data } = await axios.get('/api/auth/profile', config);
          // Merge server data with existing token
          const updatedUser = { ...data, token: user.token };
          setUser(updatedUser);
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        } catch (err) {
          console.error('Failed to sync profile:', err);
          if (err.response?.status === 401) logout();
        }
      }
    };
    syncProfile();
  }, [user?.token]);

  const login = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
    } catch (err) {
      console.error('LocalStorage Save Error:', err);
      // Even if localStorage fails (quota), we keep user in state
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
