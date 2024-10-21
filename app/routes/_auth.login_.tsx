import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { Icon } from '@iconify/react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/lib/schemas';
import { db } from '~/.server/db';
import { commitSession, getSession } from '~/services/session.server';
import { Icons, icons } from '~/lib/icons';
import { spreadRecordIntoSession } from '~/.server/utils';
import { redirectWithSuccess } from 'remix-toast';
import bcrypt from 'bcryptjs';
import { useTranslations } from 'use-intl';
import { getTranslations } from '~/services/next-i18n';

const Login = () => {
  const t = useTranslations('form');
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    shouldValidate: 'onInput',
    shouldRevalidate: 'onInput',
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });
  const navigation = useNavigation();
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
            error={fields.username.errors && t(fields.username.errors[0])}
            leftSection={<Icons.profile />}
            autoComplete='off'
          />
          <PasswordInput
            label={t('password')}
            leftSection={<Icons.password />}
            name='password'
            error={fields.password.errors && t(fields.password.errors[0])}
            autoComplete='off'
          />
          {form.errors && (
            <Alert
              variant='outline'
              color='red'
              icon={<Icon icon={icons.error} />}
            >
              {t(form.errors[0])}
            </Alert>
          )}
          <Button
            type='submit'
            loading={navigation.state !== 'idle'}
            leftSection={<Icons.login />}
          >
            {t('login')}
          </Button>
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

  const userRecord = await db.query.users.findFirst({
    where: ({ username }, op) => op.eq(username, submission.value.username),
    with: {
      prefs: true,
    },
  });

  // return if there is no matching user
  if (!userRecord) {
    return submission.reply({
      formErrors: ['credentials_invalid'],
    });
  }

  const isValidPassword = await bcrypt.compare(
    submission.value.password,
    userRecord.password
  );

  console.log('is it valid', isValidPassword);

  if (!isValidPassword) {
    return submission.reply({
      formErrors: ['credentials_invalid'],
    });
  }

  const session = await getSession(request.headers.get('Cookie'));
  session.set(authenticator.sessionKey, spreadRecordIntoSession(userRecord));
  // const t = (t) => t;
  const t = await getTranslations(request);

  return redirectWithSuccess(
    '/feed',
    {
      message: t('form.successfully_logged_in'),
      description: t('form.successfully_logged_in_description'),
    },
    {
      headers: { 'Set-Cookie': await commitSession(session) },
    }
  );
}

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   return await authenticator.isAuthenticated(request, {
//     successRedirect: '/feed',
//   });
// };

export default Login;
