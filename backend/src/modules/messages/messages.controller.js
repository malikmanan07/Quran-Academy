import * as service from './messages.service.js';

export const send = async (req, res) => {
  try {
    const msg = await service.sendMessage({ senderId: req.user.id, receiverId: req.body.receiverId, message: req.body.message });
    const io = req.app.get('io');
    if (io) io.to(`user_${req.body.receiverId}`).emit('new_message', msg);
    res.status(201).json({ success: true, data: msg });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const inbox = async (req, res) => {
  try {
    const data = await service.getInbox(req.user.id);
    res.json({ success: true, data: { conversations: data } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const conversation = async (req, res) => {
  try {
    await service.markConversationRead(req.user.id, req.params.userId);
    const data = await service.getConversation(req.user.id, req.params.userId);
    res.json({ success: true, data: { messages: data } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const markRead = async (req, res) => {
  try {
    await service.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const unreadCount = async (req, res) => {
  try {
    const count = await service.getUnreadCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const searchUsers = async (req, res) => {
  try {
    const users = await service.searchUsers(req.user.id, req.query.query);
    res.json({ success: true, data: { users } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
