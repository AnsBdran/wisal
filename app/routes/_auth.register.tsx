import { useForm } from '@conform-to/react';
import { conformZodMessage, parseWithZod } from '@conform-to/zod';
import {
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { RegisterSchemaType, registerSchema } from '~/lib/schemas';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { UserSession } from '~/lib/types';
import { spreadRecordIntoSession } from '~/.server/utils';

const Register = () => {
  const { t } = useTranslation('form');
  const lastResult = useActionData<typeof action>();
  const [
    form,
    { firstName, lastName, password, passwordConfirmation, username },
  ] = useForm<z.infer<RegisterSchemaType>>({ lastResult });
  return (
    <>
      <Form method='post' id={form.id} onSubmit={form.onSubmit}>
        <Title mb={'xl'}>{t('register')}</Title>
        <Stack>
          <Group grow>
            <TextInput
              label={t('first_name')}
              name={firstName.name}
              error={t(firstName.errors ?? '')}
            />
            <TextInput
              label={t('last_name')}
              name={lastName.name}
              error={t(lastName.errors ?? '')}
            />
          </Group>
          <TextInput
            label={t('username')}
            name={username.name}
            error={t(username.errors ?? '')}
          />
          <PasswordInput
            label={t('password')}
            name={password.name}
            error={t(password.errors ?? '')}
          />
          <PasswordInput
            label={t('password_confirmation')}
            name={passwordConfirmation.name}
            error={t(passwordConfirmation.errors ?? '')}
          />
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

  session.set(authenticator.sessionKey, spreadRecordIntoSession(newUser));
  return redirect('/feed', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
};
