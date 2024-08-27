import { Button, Fieldset, Group, Input, InputLabel } from '@mantine/core'
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node'
import { Form } from '@remix-run/react'
import React from 'react'
import { db } from '~/.server/db'
import { user } from '~/.server/db/schema'
import { authenticator } from '~/services/auth.server'
import { commitSession, getSession } from '~/services/session.server'

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
    )
}

export default Register


export const loader: LoaderFunction = async ({ request }) => {
    return authenticator.isAuthenticated(request, {
        successRedirect: '/feed'
    })
}


export let action: ActionFunction = async ({ request }) => {
    // get the user info from the formData, however you are doing it, this
    // depends on your app
    // let userInfo = await getUserInfo(request)
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const newUser = await db.insert(user).values(data).returning()
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
    console.log(data, newUser)
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
    // return null;
    const session = await getSession(request.headers.get('cookie'));
    session.set(authenticator.sessionKey, newUser);
    return redirect('/feed', {
        headers: { 'Set-Cookie': await commitSession(session) }
    })
    // register the user with your function
    // let user = await signup(userInfo)

    // get the session object from the cookie header, the getSession should
    // be the same returned by the sessionStorage you pass to Authenticator
    // let session = await getSession(request.headers.get("cookie"))

    // store the user in the session using the sessionKey of the
    // Authenticator, this will ensure the Authenticator isAuthenticated
    // method will be able to access it
    // session.set(authenticator.sessionKey, user)

    // redirect the user somewhere else, the important part is the session
    // commit, you could also return a json response with this header
    // return redirect("/somewhere", {
    //     headers: { "Set-Cookie": await commitSession(session) },
    // });
}