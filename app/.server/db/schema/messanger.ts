import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import { relations } from 'drizzle-orm';

export const message = pgTable('messages', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  content: text('content').notNull(),
  conversationID: integer('conversation_id')
    .notNull()
    .references(() => conversation.id),
  fromID: integer('from_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

export const conversation = pgTable('conversation', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  image: varchar('image'),
  bio: text('bio'),
});

export const conversationMember = pgTable('conversation_member', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  conversationID: integer('conversation_id')
    .references(() => conversation.id, { onDelete: 'cascade' })
    .notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  leftAt: timestamp('left_at'),
  userID: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  members: many(conversationMember),
  messages: many(message),
}));

export const conversationMemberRelations = relations(
  conversationMember,
  ({ one }) => ({
    user: one(user, {
      fields: [conversationMember.userID],
      references: [user.id],
    }),
    conversation: one(conversation, {
      fields: [conversationMember.conversationID],
      references: [conversation.id],
    }),
  })
);

export const messageRelations = relations(message, ({ one, many }) => ({
  conversation: one(conversation, {
    fields: [message.conversationID],
    references: [conversation.id],
  }),
  sender: one(user, { fields: [message.fromID], references: [user.id] }),
}));
