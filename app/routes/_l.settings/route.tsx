import { Icon } from '@iconify/react';
import { ActionIcon, Box, Button, Group, Tabs, Title } from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { INTENTS } from '~/lib/constants';
import { icons } from '~/lib/icons';
import { authenticator } from '~/services/auth.server';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { parseWithZod } from '@conform-to/zod';
import { appSchema, profileSchema } from '~/lib/schemas';
import { jsonWithSuccess, redirectWithSuccess } from 'remix-toast';
import { AppForm, ProfileForm } from './components';
import { authenticateOrToast, spreadRecordIntoSession } from '~/.server/utils';
import { userPrefs } from '~/services/user-prefs.server';
import { commitSession, getSession } from '~/services/session.server';
import i18next from '~/services/i18n.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;
  // const locale = await i18next.getLocale(request);
  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.id, user?.id));
  return json({ user: userRecord[0] });
};

export const handle = {
  i18n: ['common', 'settings', 'form'],
};

const Settings = () => {
  const { i18n, t } = useTranslation();
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  return (
    <>
      <Box>
        <Group justify='space-between' mb='lg'>
          <Title>{t('settings')}</Title>
          <ActionIcon
            variant='outline'
            onClick={() => {
              fetcher.submit(
                { intent: INTENTS.syncProfileData },
                { method: 'POST' }
              );
            }}
          >
            <Icon icon={icons.sync} />
          </ActionIcon>
        </Group>

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
            <AppForm defaultValue={{ locale: i18n.language as 'en' | 'ar' }} />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </>
  );
};

export default Settings;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = await authenticator.isAuthenticated(request);
  const userID = Number(user?.id);
  const intent = formData.get('intent');
  const t = await i18next.getFixedT(request, 'settings');
  const response = await authenticateOrToast(request);
  if (!response.user) return response.loginRedirect;

  if (intent === INTENTS.editProfile) {
    const submission = parseWithZod(formData, { schema: profileSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }
    await db
      .update(users)
      .set({ ...submission.value })
      .where(eq(users.id, userID));

    return redirectWithSuccess('/feed', {
      message: t('updated_successfully'),
      description: t('profile_updated'),
    });
  } else if (intent === INTENTS.editApp) {
    const submission = parseWithZod(formData, { schema: appSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }
    const t = await i18next.getFixedT(submission.value.locale, 'settings');
    const userPrefsSession = await userPrefs.getSession(
      request.headers.get('Cookie')
    );
    userPrefsSession.set('locale', submission.value.locale);
    return redirectWithSuccess(
      '/feed',
      {
        message: t('updated_successfully'),
        description: t('profile_updated'),
      },
      {
        headers: {
          'Set-Cookie': await userPrefs.commitSession(userPrefsSession),
        },
      }
    );
  } else if (intent === INTENTS.syncProfileData) {
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userID));
    const session = await getSession(request.headers.get('Cookie'));
    session.set(
      authenticator.sessionKey,
      spreadRecordIntoSession(userRecord[0])
    );
    return jsonWithSuccess(
      { success: true },
      {
        message: t('profile_synced_successfully'),
        description: t('profile_synced_successfully_description'),
      },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      }
    );
  }
  return null;
};
