import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  primaryKey,
  unique,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';
import {
  ChatMemberRole,
  ChatType,
  MessageContentType,
  ReactionType,
  UserStatus,
} from './enums';

export const messages = pgTable('messages', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  contentType: MessageContentType('content_type').default('text').notNull(),
  content: varchar('content').notNull(),
  // content: jsonb('content').notNull(),
  chatID: uuid('chat_id').notNull(),
  // .references((): any => .id),
  senderID: integer('from_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
  replyToID: integer('reply_to_id').references((): any => messages.id),
  readBy: integer('read_by').array(),
  chatType: ChatType('chat_type').notNull(),
});

// export const chatMessages = pgTable('chat_messages', {
//   id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
//   createdAt: timestamp('created_at', { withTimezone: true })
//     .defaultNow()
//     .notNull(),
//   contentType: MessageContentType('content_type').default('text').notNull(),
//   content: jsonb('content').notNull(),
//   chatID: integer('chat_id')
//     .notNull()
//     .references(() => groupChats.id),
//   senderID: integer('from_id')
//     .references(() => users.id, { onDelete: 'cascade' })
//     .notNull(),
//   isEdited: boolean('is_edited').default(false).notNull(),
//   replyToID: integer('reply_to_id').references((): any => chatMessages.id),
//   readBy: integer('read_by').array(),
// });

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  image: varchar('image'),
  bio: text('bio'),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  creatorID: integer('creator_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  // .notNull(),
});

export const directChats = pgTable('direct_chats', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
});

export const chatMembers = pgTable('chat_members', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  chatID: uuid('chat_id')
    .references(() => chats.id, { onDelete: 'cascade' })
    .notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  leftAt: timestamp('left_at', { withTimezone: true }),
  userID: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  role: ChatMemberRole('role').default('member').notNull(),
  nickname: varchar('nickname', { length: 50 }),
  isBanned: boolean('is_banned').default(false).notNull(),
  isMuted: boolean('is_muted').default(false).notNull(),
});

export const directChatMembers = pgTable(
  'direct_chat_members',
  {
    chatID: uuid('chat_id')
      .references(() => directChats.id)
      .notNull(),

    userID: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.chatID, t.userID] }),
  })
);

export const messageReactions = pgTable(
  'message_reactions',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    messageID: integer('message_id')
      .references(() => messages.id, { onDelete: 'cascade' })
      .notNull(),
    userID: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: ReactionType('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    uniqueReaction: unique().on(t.messageID, t.userID, t.type),
  })
);

export const userPresence = pgTable('user_presences', {
  userID: integer('user_id')
    .references(() => users.id)
    .notNull()
    .primaryKey(),
  lastActive: timestamp('last_active', { withTimezone: true }).notNull(),
  status: UserStatus('status').default('offline').notNull(),
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// relations +++++++++++++++++++++++++++++++++++++++++++++
export const chatRelations = relations(chats, ({ many }) => ({
  members: many(chatMembers),
  messages: many(messages),
}));

export const chatMembersRelations = relations(chatMembers, ({ one }) => ({
  user: one(users, {
    fields: [chatMembers.userID],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [chatMembers.chatID],
    references: [chats.id],
  }),
}));

export const directChatRelations = relations(directChats, ({ many, one }) => ({
  messages: many(messages),
  members: many(directChatMembers),
}));

export const directChatMembersRelations = relations(
  directChatMembers,
  ({ one }) => ({
    chat: one(directChats, {
      fields: [directChatMembers.chatID],
      references: [directChats.id],
    }),
    user: one(users, {
      fields: [directChatMembers.userID],
      references: [users.id],
    }),
  })
);

export const messagesRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatID],
    references: [chats.id],
    relationName: 'chat',
  }),
  directChat: one(directChats, {
    fields: [messages.chatID],
    references: [directChats.id],
    relationName: 'directChat',
  }),
  sender: one(users, { fields: [messages.senderID], references: [users.id] }),
  replyTo: one(messages, {
    fields: [messages.replyToID],
    references: [messages.id],
  }),
  reactions: many(messageReactions),
}));

export const messageReactionsRelations = relations(
  messageReactions,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageReactions.messageID],
      references: [messages.id],
    }),
    user: one(users, {
      fields: [messageReactions.userID],
      references: [users.id],
    }),
  })
);
