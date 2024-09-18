import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import {
  ActionFunctionArgs,
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
import { commitSession, getSession } from '~/services/session.server';
import { icons } from '~/lib/icons';
import i18next from '~/services/i18n.server';

// export const handle = {
//   i18n: 'auth',
// };

const Login = () => {
  const { t } = useTranslation('form');
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });
  return (
    // <Form method='post'>
    <>
      <Title>{t('login')}</Title>
      <Form method='post' onSubmit={form.onSubmit} autoComplete='off'>
        <Stack py='xl'>
          <TextInput
            label={t('username')}
            name='username'
            defaultValue={fields.username.value}
            error={t(fields.username.errors ?? '')}
            leftSection={<Icon icon={icons.profile} />}
            autoComplete='off'
          />
          <PasswordInput
            label={t('password')}
            leftSection={<Icon icon={icons.lock} />}
            name='password'
            error={t(fields.password.errors ?? '')}
            autoComplete='off'
          />
          {form.errors && (
            <Alert
              variant='outline'
              color='red'
              icon={<Icon icon={icons.error} />}
            >
              {form.errors}
            </Alert>
          )}
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

  const t = await i18next.getFixedT('ar', 'form');

  const userRecord = await db.query.users.findFirst({
    where: ({ username }, op) => op.eq(username, submission.value.username),
    with: {
      prefs: true,
    },
  });

  // return if there is no matching user
  if (!userRecord || userRecord.password !== submission.value.password) {
    return submission.reply({
      formErrors: [t('credentials_invalid')],
    });
  }

  // if () {
  //   return submission.reply({
  //     fieldErrors: { password: ['hi worng password'] },
  //   });
  // }

  const session = await getSession(request.headers.get('cookie'));
  session.set(authenticator.sessionKey, {
    id: userRecord.id,
    role: userRecord.role,
    locale: userRecord.prefs?.locale,
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
