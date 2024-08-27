// import { sql } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  unique,
} from 'drizzle-orm/pg-core';
import { ReactionType } from './enums';
import { sql } from 'drizzle-orm/sql';
import { user } from './user';
import { relations } from 'drizzle-orm';
import { image, postImage } from './meta';
// import { now } from './meta';

export const now = () => sql<Date>`now()`;

export const post = pgTable('posts', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(now),
  title: varchar('name', { length: 255 }).notNull(),
  content: text('content').notNull(),
  userID: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

export const postReaction = pgTable(
  'posts_reactions',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    type: ReactionType('type').notNull(),
    userID: integer('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    postID: integer('post_Id')
      .references(() => post.id)
      .notNull(),
  },
  (table) => ({
    uniqueUserPostReaction: unique().on(table.postID, table.userID),
  })
);
export const commentReaction = pgTable(
  'comments_reactions',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    type: ReactionType('type').notNull(),
    userID: integer('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    commentID: integer('comment_Id')
      .references(() => comment.id)
      .notNull(),
  },
  (table) => ({
    uniqueUserPostReaction: unique().on(table.commentID, table.userID),
  })
);

export const comment = pgTable('comments', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  content: text('content').notNull(),
  postsID: integer('post_id')
    .references(() => post.id, { onDelete: 'cascade' })
    .notNull(),
  userID: integer('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
});

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
    .references(() => user.id)
    .notNull(),
});
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// relations
export const postRelations = relations(post, ({ many, one }) => ({
  comments: many(comment),
  reactions: many(postReaction),
  user: one(user, { fields: [post.userID], references: [user.id] }),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  post: one(post, { fields: [comment.postsID], references: [post.id] }),
  reactions: many(commentReaction),
  user: one(user, { fields: [comment.userID], references: [user.id] }),
}));

export const postReactionRealtions = relations(
  postReaction,
  ({ one, many }) => ({
    post: one(post, { fields: [postReaction.postID], references: [post.id] }),
    user: one(user, { fields: [postReaction.userID], references: [user.id] }),
    images: many(image),
  })
);

export const commentReactionRealtions = relations(
  commentReaction,
  ({ one }) => ({
    comment: one(comment, {
      fields: [commentReaction.commentID],
      references: [comment.id],
    }),
    user: one(user, {
      fields: [commentReaction.userID],
      references: [user.id],
    }),
  })
);

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
