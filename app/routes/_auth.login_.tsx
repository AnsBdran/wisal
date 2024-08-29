import {
  Box,
  Button,
  Fieldset,
  Input,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticator } from '~/services/auth.server';
import { Icon } from '@iconify/react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { loginSchema } from '~/lib/schemas';

export const handle = {
  i18n: 'auth',
};

const Login = () => {
  const { t } = useTranslation('auth');
  const lastResult = useActionData();
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    lastResult,
    onValidate: ({ formData }) => {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });
  return (
    <Form method='post' onSubmit={form.onSubmit}>
      <div>{form.errors}</div>
      <Stack py='xl'>
        <TextInput
          label={t('email')}
          placeholder='example@example.io'
          leftSection={<Icon icon='tabler:brand-mailgun' />}
        />
        <div>{fields.username.errors}</div>
        <PasswordInput
          label={t('password')}
          leftSection={<Icon icon='tabler:lock-password' />}
        />
        <div>{fields.username.password}</div>
        <Button type='submit'>{t('login')}</Button>
      </Stack>
    </Form>
  );
};

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('user-pass', request, {
    successRedirect: '/feed',
    failureRedirect: '/login',
  });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/feed',
  });
};

export default Login;
