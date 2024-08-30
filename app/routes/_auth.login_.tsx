import {
  Box,
  Button,
  Fieldset,
  Input,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
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

export const handle = {
  i18n: 'auth',
};

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
    <Form method='post' onSubmit={form.onSubmit}>
      <div>{form.errors}</div>
      <Stack py='xl'>
        <TextInput
          label={t('username')}
          name='username'
          placeholder='example@example.io'
          defaultValue={fields.username.value}
          leftSection={<Icon icon='lets-icons:e-mail-light' />}
        />
        <div>{fields.username.errors}</div>
        <PasswordInput
          label={t('password')}
          leftSection={<Icon icon='tabler:lock-password' />}
          name='password'
        />
        <div>{fields.password.errors}</div>
        <Button type='submit'>{t('login')}</Button>
      </Stack>
    </Form>
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

  return await authenticator.authenticate('form', request, {
    successRedirect: '/feed',
    failureRedirect: '/login',
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json(
    await authenticator.isAuthenticated(request, {
      successRedirect: '/feed',
    })
  );
};

export default Login;
