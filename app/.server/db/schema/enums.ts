import { pgEnum } from 'drizzle-orm/pg-core';

export const ReactionType = pgEnum('reaction_type', [
  'haha',
  'like',
  'dislike',
  'love',
  'sad',
  'angry',
  'wow',
]);
export const UserRole = pgEnum('user_role', ['user', 'admin', 'super_admin']);
export const Locale = pgEnum('locale', ['ar', 'en']);
