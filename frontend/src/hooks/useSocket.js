import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const useSocket = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const notificationRef = useRef(addNotification);
  useEffect(() => { notificationRef.current = addNotification; }, [addNotification]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverUrl = apiUrl.replace(/\/api$/, '');

    const socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('register', user.id);
    });

    socket.on('notification', (data) => {
      if (notificationRef.current) notificationRef.current(data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]); // Minimal dependencies to prevent loops

  return socketRef.current;
};
