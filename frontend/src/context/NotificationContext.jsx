import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // In a real app, you'd fetch initial notifications from a database here
  // For now we just load anything saved in session storage
  useEffect(() => {
    const saved = sessionStorage.getItem('qa_notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => {
      const newNotifs = [notification, ...prev];
      sessionStorage.setItem('qa_notifications', JSON.stringify(newNotifs.slice(0, 50)));
      return newNotifs;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const newNotifs = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      sessionStorage.setItem('qa_notifications', JSON.stringify(newNotifs.slice(0, 50)));
      return newNotifs;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    sessionStorage.removeItem('qa_notifications');
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearAll, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
