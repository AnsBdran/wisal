import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';

// type User = Omit<typeof user.$inferSelect, 'password'>;
type User = {
  id: number;
  locale: 'ar' | 'en';
  role: 'admin' | 'user';
};
export const authenticator = new Authenticator<User>(sessionStorage);

// authenticator.use(
// new FormStrategy(async ({ context }) => {
//   if (context && 'user' in context && typeof context.user === 'object') {
//     const { id, locale, role } = context.user;
//     return { id, locale, role };
//   }
//   throw new Error('Invalid authentication request');
// }),
// 'user-pass'
// );
