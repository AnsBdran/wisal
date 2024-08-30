import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { FormStrategy } from 'remix-auth-form';
import { db } from '~/.server/db';
import { user } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';

type User = Omit<typeof user.$inferSelect, 'password'>;

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.username, form.get('username') as string));

    return userRecord[0];
  }),
  'form'
);
