import db from '../../config/db.js';
import { messages, users } from '../../db/schema/index.js';
import { eq, or, and, desc, sql, ne, ilike } from 'drizzle-orm';

export const sendMessage = async (data) => {
  const [result] = await db.insert(messages).values(data).returning();
  return result;
};

export const getInbox = async (userId) => {
  // Get latest message per conversation partner
  const rows = await db.execute(sql`
    SELECT DISTINCT ON (partner_id) *
    FROM (
      SELECT m.*, 
        CASE WHEN m.sender_id = ${userId} THEN m.receiver_id ELSE m.sender_id END as partner_id,
        u.name as partner_name, u.role as partner_role
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.sender_id = ${userId} THEN m.receiver_id ELSE m.sender_id END
      WHERE m.sender_id = ${userId} OR m.receiver_id = ${userId}
      ORDER BY partner_id, m.created_at DESC
    ) sub
    ORDER BY partner_id, created_at DESC
  `);
  return rows.rows || rows;
};

export const getConversation = async (userId, partnerId) => {
  return db.select({
    id: messages.id,
    senderId: messages.senderId,
    receiverId: messages.receiverId,
    message: messages.message,
    isRead: messages.isRead,
    createdAt: messages.createdAt,
  }).from(messages)
    .where(or(
      and(eq(messages.senderId, userId), eq(messages.receiverId, partnerId)),
      and(eq(messages.senderId, partnerId), eq(messages.receiverId, userId))
    ))
    .orderBy(messages.createdAt);
};

export const markAsRead = async (id) => {
  const [result] = await db.update(messages).set({ isRead: true }).where(eq(messages.id, id)).returning();
  return result;
};

export const markConversationRead = async (userId, partnerId) => {
  await db.update(messages).set({ isRead: true })
    .where(and(eq(messages.senderId, partnerId), eq(messages.receiverId, userId)));
};

export const getUnreadCount = async (userId) => {
  const [{ count }] = await db.select({ count: sql`count(*)` })
    .from(messages).where(and(eq(messages.receiverId, userId), eq(messages.isRead, false)));
  return Number(count);
};

export const searchUsers = async (userId, query) => {
  let condition = ne(users.id, userId);
  if (query) {
    condition = and(
      ne(users.id, userId),
      or(
        ilike(users.name, `%${query}%`),
        ilike(users.email, `%${query}%`)
      )
    );
  }
  return db.select({
    id: users.id,
    name: users.name,
    role: users.role,
    avatar: users.avatar
  })
  .from(users)
  .where(condition)
  .limit(20);
};
