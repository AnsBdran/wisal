import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { UserSession } from '~/lib/types';

// type User = Omit<typeof user.$inferSelect, 'password'>;

export const authenticator = new Authenticator<UserSession>(sessionStorage);

// authenticator.use(
//   new FormStrategy(async ({ context }) => {
//     if (context && 'user' in context && typeof context.user === 'object') {
//       const { id, locale, role } = context.user;
//       return { id, locale, role };
//     }
//     throw new Error('Invalid authentication request');
//   }),
//   'user-pass'
// );
