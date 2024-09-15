import { Button, Fieldset, Group, Input, InputLabel } from '@mantine/core';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';

const Register = () => {
  return (
    <>
      <Form method='post'>
        <Fieldset className='space-y-4'>
          <Group className='justify-between [&>*]:flex-1 '>
            <InputLabel>الاسم الأول</InputLabel>
            <Input name='firstName' />
          </Group>
          <Group className='justify-between [&>*]:flex-1 '>
            <InputLabel>الاسم الأخير</InputLabel>
            <Input name='lastName' />
          </Group>

          <Group className='justify-between [&>*]:flex-1 '>
            <InputLabel>اسم المستخدم</InputLabel>
            <Input name='username' />
          </Group>

          <Group className='justify-between [&>*]:flex-1 '>
            <InputLabel>البريد الإلكتروني</InputLabel>
            <Input name='email' />
          </Group>
          <Group className='justify-between [&>*]:flex-1 '>
            <InputLabel>كلمة المرور</InputLabel>
            <Input name='password' />
          </Group>
          <Group className='justify-between [&>*]:flex-1 '>
            <InputLabel>تأكيد كلمة المرور</InputLabel>
            <Input name='password_confirmation' />
          </Group>
          <Button type='submit'>التسجيل</Button>
        </Fieldset>
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
  const data = Object.fromEntries(formData);
  const newUser = await db.insert(users).values(data).returning();
  const session = await getSession(request.headers.get('cookie'));
  session.set(authenticator.sessionKey, newUser);
  return redirect('/feed', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
};
