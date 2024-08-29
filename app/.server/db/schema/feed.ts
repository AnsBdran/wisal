// import { sql } from 'drizzle-orm';
import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  unique,
  primaryKey,
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

export const tag = pgTable('tags', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
});

export const postToTag = pgTable(
  'posts_to_tags',
  {
    tagID: integer('tag_id').references(() => tag.id, { onDelete: 'cascade' }),
    postID: integer('post_id').references(() => post.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postID, t.tagID] }),
  })
);

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// relations
export const postRelations = relations(post, ({ many, one }) => ({
  comments: many(comment),
  reactions: many(postReaction),
  user: one(user, { fields: [post.userID], references: [user.id] }),
  images: many(image),
  tags: many(postToTag),
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
    // images: many(image),
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

export const tagRelations = relations(tag, ({ many }) => ({
  posts: many(postToTag),
}));

export const postToTagRelations = relations(postToTag, ({ one }) => ({
  tag: one(tag, {
    fields: [postToTag.tagID],
    references: [tag.id],
  }),
  post: one(post, {
    fields: [postToTag.postID],
    references: [post.id],
  }),
}));
