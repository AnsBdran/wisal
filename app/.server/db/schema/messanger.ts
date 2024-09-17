import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';

export const messages = pgTable('messages', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  content: text('content').notNull(),
  chatID: integer('chat_id')
    .notNull()
    .references(() => chats.id),
  senderID: integer('from_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
});

export const chats = pgTable('chats', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  image: varchar('image'),
  bio: text('bio'),
});

export const chatMembers = pgTable('chat_member', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  chatID: integer('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  leftAt: timestamp('left_at'),
  userID: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const chatRelations = relations(chats, ({ many }) => ({
  members: many(chatMembers),
  messages: many(messages),
}));

export const chatMemberssRelations = relations(chatMembers, ({ one }) => ({
  user: one(users, {
    fields: [chatMembers.userID],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [chatMembers.chatID],
    references: [chats.id],
  }),
}));

export const messagessRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatID],
    references: [chats.id],
  }),
  sender: one(users, { fields: [messages.senderID], references: [users.id] }),
}));
