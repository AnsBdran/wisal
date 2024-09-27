import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { posts } from './feed';
import { relations } from 'drizzle-orm';
// import { sql } from 'drizzle-orm'

export const images = pgTable('images', {
  // id: uuid('id').primaryKey().notNull().defaultRandom(),
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  secureURL: varchar('secure_url').notNull(),
  postID: integer('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  publicID: varchar('public_id', { length: 255 }).notNull(),
  format: varchar('format').notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  height: integer('height').notNull(),
  width: integer('width').notNull(),
});

// export const postImage = pgTable('posts_images', {
//   id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
//   url: varchar('url').notNull(),
// });

// export const postImageRelations = relations(postImage, ({ one }) => ({
//   post: one(post, { fields: [postImage.postID], references: [post.id] }),
// }));
// export const userImageRelations = relations(userImage, ({ one }) => ({
//   user: one(user, { fields: [userImage.userID], references: [user.id] }),
// }));
export const imageRelations = relations(images, ({ one }) => ({
  post: one(posts, { fields: [images.postID], references: [posts.id] }),
}));
