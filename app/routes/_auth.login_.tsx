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
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticator } from '~/services/auth.server';
import { Icon } from '@iconify/react';

export const handle = {
  i18n: 'auth',
};

const Login = () => {
  const { t } = useTranslation('auth');
  return (
    <Form method='post'>
      <Stack py='xl'>
        <TextInput
          label={t('email')}
          placeholder='example@example.io'
          leftSection={<Icon icon='tabler:brand-mailgun' />}
        />
        <PasswordInput
          label={t('password')}
          leftSection={<Icon icon='tabler:lock-password' />}
        />
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
