import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loginUser, registerUser } from './api';
import handleApiError from '../../utils/handleApiError';

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginUser(credentials);
      login(data.user, data.token);
      return data;
    } catch (err) {
      const msg = handleApiError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(data);
      return response.data;
    } catch (err) {
      const msg = handleApiError(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
