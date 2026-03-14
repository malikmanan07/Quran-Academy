import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const useSocket = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    // Use baseURL for socket server (removing /api from end if present)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverUrl = apiUrl.replace(/\/api$/, '');

    socketRef.current = io(serverUrl, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register', user.id);
    });

    socketRef.current.on('notification', (data) => {
      addNotification(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, addNotification]);

  return socketRef.current;
};
