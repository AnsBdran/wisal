import { messages, users } from '~/.server/db/schema';

export type UserRecord = typeof users.$inferSelect;
export type UserSession = {
  id: number;
  locale: 'ar' | 'en';
  role: 'admin' | 'user' | 'super_admin';
};
export type Message = typeof messages.$inferSelect & {
  sender: typeof users.$inferSelect;
};
export type UserRole = 'user' | 'admin' | 'super_admin';
