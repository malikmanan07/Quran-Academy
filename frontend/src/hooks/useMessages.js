import { useState, useEffect, useCallback } from 'react';
import http from '../services/http';
import { useAuth } from '../context/AuthContext';

const useMessages = (partnerId = null) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchInbox = useCallback(async () => {
    try {
      const res = await http.get('messages/inbox');
      setConversations(res.data?.data?.conversations || []);
    } catch (err) {
      console.error('Failed to fetch inbox:', err);
    }
  }, []);

  const fetchConversation = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await http.get(`messages/conversation/${id}`);
      setMessages(res.data?.data?.messages || []);
      fetchUnreadCount();
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await http.get('messages/unread-count');
      setUnreadCount(res.data?.data?.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  const searchUsers = async (query) => {
    try {
      const res = await http.get('messages/search-users', { params: { query } });
      return res.data?.data?.users || [];
    } catch (err) {
      console.error('Failed to search users:', err);
      return [];
    }
  };

  const sendMessage = async (receiverId, text) => {
    try {
      const res = await http.post('messages/send', { receiverId, message: text });
      if (receiverId === partnerId) {
        setMessages(prev => [...prev, res.data.data]);
      }
      fetchInbox();
      return res.data.data;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (partnerId) {
      fetchConversation(partnerId);
    } else {
      fetchInbox();
    }
  }, [partnerId, fetchInbox, fetchConversation]);

  return {
    conversations,
    messages,
    unreadCount,
    loading,
    sendMessage,
    fetchInbox,
    fetchConversation,
    fetchUnreadCount,
    searchUsers
  };
};

export default useMessages;
