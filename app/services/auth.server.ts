import { Authenticator } from 'remix-auth';
import { sessionStorage } from './session.server';
import { FormStrategy } from 'remix-auth-form';
// import { invariant }
import { db } from '~/.server/db';
import { user } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
// type User = {
//     username: string
//     email: string
//     firstName: string
//     lastName: string
// }

type User = Omit<typeof user.$inferSelect, 'password'>;

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    // const email = form.get('email');
    const username = form.get('username') as string;
    const password = form.get('password');
    // let user = await login(email, password);
    // invariant(typeof username === 'string')

    const isUser = await db
      .select()
      .from(user)
      .where(eq(user.username, username));

    if (!isUser) {
      // throw new Response(null,)
      console.log('no user');
    }
    // invariant(isUser);
    // invariant(isUser[0].password === password);

    // const isAuthenticated = isUser[0].password === password

    // invariant(typeof username === "string", "username must be a string");
    // invariant(username.length > 0, "username must not be empty");

    // invariant(typeof password === "string", "password must be a string");
    // invariant(password.length > 0, "password must not be empty");

    // if
    // return 'asf'
    // return __user;
    // delete isUser[0].password;
    return isUser[0];
  }),
  'user-pass'
);
