import { messages, suggestions, users } from '~/.server/db/schema';

export type UserRecord = typeof users.$inferSelect;
export type UserSession = Omit<UserRecord, 'password' | 'createdAt'>;
// export type UserSession = {
//   id: number;
//   // locale: 'ar' | 'en';
//   firstName: string;
//   lastName: string;
//   userName: string;
//   role: 'admin' | 'user' | 'super_admin';
// };
export type Message = typeof messages.$inferSelect & {
  sender: typeof users.$inferSelect;
};
export type UserRole = 'user' | 'admin' | 'super_admin';
export type Suggestion = typeof suggestions.$inferSelect;
