import {
  Box,
  Button,
  Fieldset,
  Input,
  PasswordInput,
  Stack,
  TextInput,
  Title,
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
import { users } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { commitSession, getSession } from '~/services/session.server';
import { icons } from '~/lib/icons';

// export const handle = {
//   i18n: 'auth',
// };

const Login = () => {
  const { t } = useTranslation('form');
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
      <Title>{t('login')}</Title>
      <Form method='post' onSubmit={form.onSubmit}>
        <div>{form.errors}</div>
        <Stack py='xl'>
          <TextInput
            label={t('username')}
            name='username'
            defaultValue={fields.username.value}
            error={fields.username.errors}
            leftSection={<Icon icon={icons.profile} />}
          />
          <PasswordInput
            label={t('password')}
            leftSection={<Icon icon={icons.lock} />}
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
    .from(users)
    .where(eq(users.username, submission.value.username));

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
    // ...userRecord[0],
    // password: undefined,
    id: userRecord[0].id,
    role: userRecord[0].role,
    locale: userRecord[0].locale,
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
