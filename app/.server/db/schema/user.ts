import {
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
  text,
} from 'drizzle-orm/pg-core';
import { Locale, UserRole } from './enums';

export const users = pgTable('users', {
  // id: uuid('id').primaryKey().defaultRandom().notNull(),
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  middleName: varchar('middle_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  nickName: varchar('nickname', { length: 255 }),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: UserRole('role').default('user').notNull(),
  profileImage: varchar('profile_image', { length: 255 }),
  isVerified: boolean('is_verified').default(false).notNull(),
  bio: text('bio'),
  isApproved: boolean('is_approved').default(false).notNull(),
  locale: Locale('locale').default('ar').notNull(),
  isFamily: boolean('is_family').default(false).notNull(),
  //   profileImageID: integer('profile_image_id').references(() => image.id),
});
