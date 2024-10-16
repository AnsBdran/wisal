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
import { spreadRecordIntoSession } from '~/.server/utils';
import { redirectWithSuccess } from 'remix-toast';
import bcrypt from 'bcryptjs';

export const handle = {
  i18n: 'form',
};

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
              {t(form.errors)}
            </Alert>
          )}
          <Button type='submit' loading={navigation.state !== 'idle'}>
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

  const t = await i18next.getFixedT(request, 'form');
  return redirectWithSuccess(
    '/feed',
    {
      message: t('successfully_logged_in'),
      description: t('successfully_logged_in_description'),
    },
    {
      headers: { 'Set-Cookie': await commitSession(session) },
    }
  );
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/feed',
  });
};

export default Login;
