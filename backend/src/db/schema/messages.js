import { pgTable, serial, integer, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  senderIdIdx: index('messages_sender_idx').on(table.senderId),
  receiverIdIdx: index('messages_receiver_idx').on(table.receiverId),
  isReadIdx: index('messages_is_read_idx').on(table.isRead),
  createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  conversationIdx: index('messages_conversation_idx')
    .on(table.senderId, table.receiverId),
}));
