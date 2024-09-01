import {
  Box,
  Button,
  Fieldset,
  Input,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticator } from '~/services/auth.server';
import { Icon } from '@iconify/react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/lib/schemas';
import { db } from '~/.server/db';
import { user } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { commitSession, getSession } from '~/services/session.server';

// export const handle = {
//   i18n: 'auth',
// };

const Login = () => {
  const { t } = useTranslation('auth');
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });
  return (
    // <Form method='post'>
    <>
      <h2>Login page</h2>
      <Form method='post' onSubmit={form.onSubmit}>
        <div>{form.errors}</div>
        <Stack py='xl'>
          <TextInput
            label={t('username')}
            name='username'
            placeholder='example@example.io'
            defaultValue={fields.username.value}
            error={fields.username.errors}
            leftSection={<Icon icon='lets-icons:e-mail-light' />}
          />
          <PasswordInput
            label={t('password')}
            leftSection={<Icon icon='tabler:lock-password' />}
            name='password'
            error={fields.password.errors}
          />
          <Button type='submit'>{t('login')}</Button>
        </Stack>
      </Form>
    </>
  );
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const userRecord = await db
    .select()
    .from(user)
    .where(eq(user.username, submission.value.username));

  // return if there is no matching user
  if (!userRecord.length) {
    return submission.reply({
      formErrors: ['There is no such user'],
    });
  }

  if (userRecord[0].password !== submission.value.password) {
    return submission.reply({
      fieldErrors: { password: ['hi worng password'] },
    });
  }

  const session = await getSession(request.headers.get('cookie'));
  session.set(authenticator.sessionKey, {
    ...userRecord[0],
    password: undefined,
  });
  return redirect('/feed', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });

  // return await authenticator.authenticate('user-pass', request, {
  //   successRedirect: '/feed',
  //   failureRedirect: '/login',
  //   context: userRecord[0],
  // });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/feed',
  });
};

export default Login;
