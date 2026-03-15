import { useState, useEffect, useCallback } from 'react';
import http from '../services/http';
import { useAuth } from '../context/AuthContext';
import { getCache, cachedRequest, invalidateCache } from '../services/apiCache';

const useMessages = (partnerId = null) => {
  const { user } = useAuth();
  
  const inboxKey = `messages:inbox:${user?.id}`;
  const initialInbox = getCache(inboxKey);
  
  const [conversations, setConversations] = useState(initialInbox || []);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchInbox = useCallback(async () => {
    try {
      // 30 Seconds inbox caching to balance real-time nature but prevent tab-flicker reload fatigue
      const data = await cachedRequest(inboxKey, async () => {
        const res = await http.get('messages/inbox');
        return res.data?.data?.conversations || [];
      }, 30);
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch inbox:', err);
    }
  }, [inboxKey]);

  const fetchConversation = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await http.get(`messages/conversation/${id}`);
      setMessages(res.data?.data?.messages || []);
      
      fetchUnreadCount();
      invalidateCache('messages:inbox');
      fetchInbox();
      window.dispatchEvent(new Event('messages_updated'));
      
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchInbox]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await http.get('messages/unread-count');
      setUnreadCount(res.data?.data?.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  const searchUsers = useCallback(async (query) => {
    try {
      const res = await http.get('messages/search-users', { params: { query } });
      return res.data?.data?.users || [];
    } catch (err) {
      console.error('Failed to search users:', err);
      return [];
    }
  }, []);

  const sendMessage = useCallback(async (receiverId, text) => {
    try {
      const res = await http.post('messages/send', { receiverId, message: text });
      if (receiverId === partnerId) {
        setMessages(prev => [...prev, res.data.data]);
      }
      
      // Force instant refresh of Inbox list (invalidate cache + fetch manually)
      invalidateCache('messages:inbox');
      fetchInbox();
      
      return res.data.data;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  }, [partnerId, fetchInbox]);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleUpdate = () => {
      invalidateCache('messages:inbox');
      fetchInbox();
      fetchUnreadCount();
      if (partnerId) fetchConversation(partnerId);
    };

    window.addEventListener('messages_updated', handleUpdate);
    return () => window.removeEventListener('messages_updated', handleUpdate);
  }, [partnerId, fetchInbox, fetchUnreadCount, fetchConversation]);

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
