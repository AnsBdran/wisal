import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import {
  Alert,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useTranslations } from 'use-intl';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { RegisterSchemaType, registerSchema } from '~/lib/schemas';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';
import bcrypt from 'bcryptjs';
import { spreadRecordIntoSession } from '~/.server/utils';
import { redirectWithSuccess } from 'remix-toast';
import { getTranslations } from '~/services/next-i18n';

export const handle = {
  i18n: 'form',
};

const Register = () => {
  const t = useTranslations('form');
  const lastResult = useActionData<typeof action>();
  const [
    form,
    { firstName, lastName, password, passwordConfirmation, username },
  ] = useForm<RegisterSchemaType>({ lastResult });
  return (
    <>
      <Form method='post' id={form.id} onSubmit={form.onSubmit}>
        <Title mb={'xl'}>{t('register')}</Title>
        <Stack>
          <Group grow>
            <TextInput
              label={t('first_name')}
              name={firstName.name}
              error={firstName.errors && t(firstName.errors[0])}
            />
            <TextInput
              label={t('last_name')}
              name={lastName.name}
              error={lastName.errors && t(lastName.errors[0])}
            />
          </Group>
          <TextInput
            label={t('username')}
            name={username.name}
            error={username.errors && t(username.errors[0])}
          />
          <PasswordInput
            label={t('password')}
            name={password.name}
            error={password.errors && t(password.errors[0])}
          />
          <PasswordInput
            label={t('password_confirmation')}
            name={passwordConfirmation.name}
            error={
              passwordConfirmation.errors && t(passwordConfirmation.errors[0])
            }
          />
          {form.errors && (
            <Alert variant='light' color='red'>
              {t(form.errors[0])}
            </Alert>
          )}
          <Button type='submit'>{t('register')}</Button>
        </Stack>
      </Form>
    </>
  );
};

export default Register;

export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: '/feed',
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: registerSchema });
  if (submission.status !== 'success') {
    return submission.reply();
  }
  const { password, firstName, lastName, username } = submission.value;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    const response = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        username,
        password: passwordHash,
      })
      .returning();
    const newUser = response[0];
    const session = await getSession(request.headers.get('cookie'));
    const t = await getTranslations(request);
    session.set(authenticator.sessionKey, spreadRecordIntoSession(newUser));
    return redirectWithSuccess(
      '/feed',
      {
        message: t('form.successfully_registered'),
        description: t('form.successfully_logged_in_description'),
      },
      {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    );
  } catch {
    return submission.reply({
      formErrors: ['user_already_exists'],
    });
  }
};
