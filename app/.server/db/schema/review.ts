import {
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
  boolean,
  unique,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';

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
  description: varchar('description', { length: 255 }),
  votesCount: integer('votes').default(0).notNull(),
});

export const votes = pgTable(
  'votes',
  {
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
  },
  (t) => ({
    uniqueVote: unique().on(t.userID, t.suggestionID),
  })
);

export const suggestionRelations = relations(suggestions, ({ many }) => ({
  choices: many(choices),
}));

export const choiceRelations = relations(choices, ({ one, many }) => ({
  suggestion: one(suggestions, {
    fields: [choices.suggestionID],
    references: [suggestions.id],
  }),
  votes: many(votes),
}));

export const voteRelations = relations(votes, ({ one }) => ({
  choice: one(choices, { fields: [votes.choiceID], references: [choices.id] }),
  user: one(users, { fields: [votes.userID], references: [users.id] }),
  suggestion: one(suggestions, {
    fields: [votes.suggestionID],
    references: [suggestions.id],
  }),
}));
