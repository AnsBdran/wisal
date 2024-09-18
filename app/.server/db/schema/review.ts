import {
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './user';
export const suggestions = pgTable('suggestions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  isAccepted: boolean('is_accepted').default(false),
});

export const choices = pgTable('choices', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  suggestionID: integer('suggestion_id')
    .references(() => suggestions.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  votes: integer('votes').default(0).notNull(),
});

export const votes = pgTable('votes', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  userID: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  suggestionID: integer('suggestion_id')
    .references(() => suggestions.id, { onDelete: 'cascade' })
    .notNull(),
  choiceID: integer('choice_id')
    .references(() => choices.id, { onDelete: 'cascade' })
    .notNull(),
});
