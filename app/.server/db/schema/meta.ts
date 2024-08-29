import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { post } from './feed';
import { relations } from 'drizzle-orm';
// import { sql } from 'drizzle-orm'

export const image = pgTable('images', {
  // id: uuid('id').primaryKey().notNull().defaultRandom(),
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  url: varchar('url').notNull(),
  postID: integer('post_id')
    .references(() => post.id, { onDelete: 'cascade' })
    .notNull(),
  // userID: integer('user_id')
  //   .references(() => user.id, { onDelete: 'cascade' })
  //   .notNull(),
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
export const imageRelations = relations(image, ({ one }) => ({
  post: one(post, { fields: [image.postID], references: [post.id] }),
}));
