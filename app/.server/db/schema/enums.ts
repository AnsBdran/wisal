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
export const ItemsPerPage = pgEnum('items_per_page', [
  'eight',
  'twelve',
  'fifteen',
]);
export const ChatMemberRole = pgEnum('chat_member_role', ['admin', 'member']);

export const UserStatus = pgEnum('user_status', ['active', 'idle', 'offline']);

export const MessageContentType = pgEnum('message_content_type', [
  'text',
  'image',
  'file',
]);

export const ChatType = pgEnum('chat_type', ['group', 'direct']);
