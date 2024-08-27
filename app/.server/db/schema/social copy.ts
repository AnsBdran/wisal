// import { sql } from 'drizzle-orm';
import { pgTable, timestamp, varchar, text, integer, unique } from 'drizzle-orm/pg-core';
import { ReactionType } from './enums';
import { sql } from 'drizzle-orm/sql';
import { user } from './user';
import { relations } from 'drizzle-orm';
// import { now } from './meta';

export const now = () => sql<Date>`now()`

export const post = pgTable('posts', {
    id: integer('id',).primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .$onUpdate(now),
    title: varchar('name', { length: 255 }).notNull(),
    content: text('content').notNull(),
    userID: integer('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull()
})


export const reaction = pgTable('reactions', {
    id: integer('id',).primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    type: ReactionType('type').notNull(),
    key: varchar('key', { length: 255 }).notNull(),
    userID: integer('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),

}, table => ({
    uniqueUserPostReaction: unique().on(table.key, table.userID)
}))

export const comment = pgTable('comments', {
    id: integer('id',).primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    content: text('content').notNull(),
    postsID: integer('post_id').references(() => post.id, { onDelete: 'cascade' }).notNull(),
    userID: integer('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull()
})

export const message = pgTable('messages', {
    id: integer('id',).primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true },).defaultNow().notNull(),
    content: text('content').notNull(),
    conversationID: integer('conversation_id').notNull().references(() => conversation.id),
    fromID: integer('from_id').references(() => user.id, { onDelete: 'cascade' })
});

export const conversation = pgTable('conversation', {
    id: integer('id',).primaryKey().generatedByDefaultAsIdentity(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    name: varchar('name', { length: 255 }).notNull()
})

export const conversationMember = pgTable('conversation_member', {
    id: integer('id',).primaryKey().generatedByDefaultAsIdentity(),
    conversationID: integer('conversation_id').references(() => conversation.id, { onDelete: 'cascade' }).notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
    leftAt: timestamp('left_at'),
    userID: integer('user_id').references(() => user.id)
})
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// relations
export const postRelations = relations(post, ({ many, one }) => ({
    comments: many(comment),
    reactions: many(reaction, { relationName: 'postReactions' }),
    user: one(user, { fields: [post.userID], references: [user.id] })
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
    post: one(post, { fields: [comment.postsID], references: [post.id] }),
    reactions: many(reaction, { relationName: 'commentReactions' }),
    user: one(user, { fields: [comment.userID], references: [user.id] })
}));

// export const reactionRelations = relations(reaction, ({ one }) => ({
//     post: one(post, { relationName: 'postReactions' }),
//     comment: one(comment, { relationName: 'commentReactions' })
// }));