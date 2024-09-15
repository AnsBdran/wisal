import { Icon } from '@iconify/react/dist/iconify.js';
import { AppShell, Box, Container, Tabs, Title } from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { redirect, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Header from '~/lib/components/main/header/index';
import { HEADER_HEIGHT } from '~/lib/constants';
import { icons } from '~/lib/icons';
import { authenticator } from '~/services/auth.server';
import { ProfileForm } from './profile-form';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { parseWithZod } from '@conform-to/zod';
import { profileSchema } from '~/lib/schemas';
import { jsonWithSuccess, redirectWithSuccess } from 'remix-toast';
import i18next from '~/services/i18n.server';
import AppForm from './app-form';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authUser = await authenticator.isAuthenticated(request);
  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser?.id));
  return json({ user: userRecord[0] });
};

const Settings = () => {
  const { i18n, t } = useTranslation();
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      <AppShell header={{ height: HEADER_HEIGHT }} padding='sm'>
        <Header user={user} />
        <AppShell.Main>
          <Container>
            <Box>
              <Title>{t('settings')}</Title>
              <Tabs defaultValue='profile_settings'>
                <Tabs.List grow mb='xl'>
                  <Tabs.Tab
                    value='profile_settings'
                    leftSection={<Icon icon={icons.profileSettings} />}
                  >
                    {t('profile_settings')}
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='app_settings'
                    leftSection={<Icon icon={icons.appSettings} />}
                  >
                    {t('app_settings')}
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value='profile_settings'>
                  <ProfileForm user={user} />
                </Tabs.Panel>
                <Tabs.Panel value='app_settings'>
                  <AppForm user={user} />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Settings;

export const action = async ({ request }: ActionFunctionArgs) => {
  const t = await i18next.getFixedT('ar', 'settings', { lng: 'ar' });
  const formData = await request.formData();
  const authUser = await authenticator.isAuthenticated(request);
  const submission = parseWithZod(formData, { schema: profileSchema });

  if (!authUser) redirect('/login');

  if (submission.status !== 'success') {
    return json(submission.reply());
  }

  await db
    .update(users)
    .set({ ...submission.value })
    .where(eq(users.id, authUser?.id));

  return jsonWithSuccess('/feed', {
    message: t('updated_successfully'),
    description: t('profile_updated'),
  });
};
