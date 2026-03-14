import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authStorage from '../services/authStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(authStorage.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, tokenData) => {
    authStorage.setUser(userData);
    authStorage.setToken(tokenData);
    setUser(userData);
    setToken(tokenData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    authStorage.clear();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);