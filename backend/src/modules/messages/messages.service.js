import * as repo from './messages.repository.js';

export const sendMessage = (data) => repo.sendMessage(data);
export const getInbox = (userId) => repo.getInbox(userId);
export const getConversation = (userId, partnerId) => repo.getConversation(userId, partnerId);
export const markAsRead = (id) => repo.markAsRead(id);
export const markConversationRead = (userId, partnerId) => repo.markConversationRead(userId, partnerId);
export const getUnreadCount = (userId) => repo.getUnreadCount(userId);
export const searchUsers = (userId, query) => repo.searchUsers(userId, query);
