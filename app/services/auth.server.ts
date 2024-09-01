import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { FormStrategy } from 'remix-auth-form';
import { user } from '~/.server/db/schema';

type User = Omit<typeof user.$inferSelect, 'password'>;

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ context }) => {
    console.log(
      '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
    );
    console.log(
      '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
    );
    console.log('authentication began');

    console.log(
      '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
    );
    console.log(
      '+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
    );

    if (context && 'user' in context && typeof context.user === 'object') {
      return context.user as User;
    }
    throw new Error('Invalid authentication request');
  }),
  'user-pass'
);
