import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  unique,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';
import { ReactionType } from './enums';
import { sql } from 'drizzle-orm/sql';
import { users } from './user';
import { relations } from 'drizzle-orm';
import { images } from './meta';

export const now = () => sql<Date>`now()`;

export const posts = pgTable('posts', {
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
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
});

export const postReactions = pgTable(
  'posts_reactions',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    type: ReactionType('type').notNull(),
    userID: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postID: integer('post_Id')
      .references(() => posts.id)
      .notNull(),
  },
  (table) => ({
    uniqueUserPostReaction: unique().on(table.postID, table.userID),
  })
);
export const commentReactions = pgTable(
  'comments_reactions',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    type: ReactionType('type').notNull(),
    userID: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    commentID: integer('comment_Id')
      .references(() => comments.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
  },
  (table) => ({
    uniqueUserPostReaction: unique().on(table.commentID, table.userID),
  })
);

export const comments = pgTable('comments', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  content: text('content').notNull(),
  postID: integer('post_id')
    .references(() => posts.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  userID: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  isEdited: boolean('is_edited').default(false).notNull(),
});

export const tags = pgTable('tags', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
});

export const postsToTags = pgTable(
  'posts_to_tags',
  {
    tagID: integer('tag_id').references(() => tags.id, { onDelete: 'cascade' }),
    postID: integer('post_id').references(() => posts.id, {
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
export const postRelations = relations(posts, ({ many, one }) => ({
  comments: many(comments),
  reactions: many(postReactions),
  user: one(users, { fields: [posts.userID], references: [users.id] }),
  images: many(images),
  tags: many(postsToTags),
}));

export const commentRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postID], references: [posts.id] }),
  reactions: many(commentReactions),
  user: one(users, { fields: [comments.userID], references: [users.id] }),
}));

export const postReactionRealtions = relations(postReactions, ({ one }) => ({
  post: one(posts, { fields: [postReactions.postID], references: [posts.id] }),
  user: one(users, { fields: [postReactions.userID], references: [users.id] }),
  // images: many(image),
}));

export const commentReactionRealtions = relations(
  commentReactions,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentReactions.commentID],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentReactions.userID],
      references: [users.id],
    }),
  })
);

export const tagRelations = relations(tags, ({ many }) => ({
  posts: many(postsToTags),
}));

export const postToTagRelations = relations(postsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [postsToTags.tagID],
    references: [tags.id],
  }),
  post: one(posts, {
    fields: [postsToTags.postID],
    references: [posts.id],
  }),
}));
