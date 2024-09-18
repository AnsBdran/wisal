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

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
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

// +++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++
export const userRelations = relations(users, ({ one }) => ({
  prefs: one(usersPrefs),
}));

export const userPrefsRelations = relations(usersPrefs, ({ one }) => ({
  user: one(users, { fields: [usersPrefs.userID], references: [users.id] }),
}));
