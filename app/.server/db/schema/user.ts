import {
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
  text,
} from 'drizzle-orm/pg-core';
import { ItemsPerPage, Locale, UserRole } from './enums';
import { relations } from 'drizzle-orm';
import { authenticator } from '~/services/auth.server';
import i18next from '~/services/i18n.server';
import { redirectWithInfo } from 'remix-toast';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  middleName: varchar('middle_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  nickname: varchar('nickname', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: UserRole('role').default('user').notNull(),
  profileImage: varchar('profile_image', { length: 255 }),
  isVerified: boolean('is_verified').default(false).notNull(),
  bio: text('bio'),
  isApproved: boolean('is_approved').default(false).notNull(),
  isFamily: boolean('is_family').default(false).notNull(),
});

export const usersPrefs = pgTable('users_prefs', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userID: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  locale: Locale('locale').default('ar').notNull(),
  itemsPerPage: ItemsPerPage('items_per_page').default('twelve').notNull(),
  showAds: boolean('show_ads').notNull().default(false),
});

export const suggestions = pgTable('suggestions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
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

// +++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++
export const userRelations = relations(users, ({ one }) => ({
  prefs: one(usersPrefs),
}));

export const userPrefsRelations = relations(usersPrefs, ({ one }) => ({
  user: one(users, { fields: [usersPrefs.userID], references: [users.id] }),
}));
