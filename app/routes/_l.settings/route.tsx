import { ActionIcon, Box, Group, Tabs, Title } from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { Icons } from '~/lib/icons';
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
import { getTranslations } from '~/services/next-i18n';
import { useLocale, useTranslations } from 'use-intl';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;
  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.id, user?.id));
  return json({ user: userRecord[0] });
};

const Settings = () => {
  const t = useTranslations('common');
  const locale = useLocale();
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
            <Icons.sync />
          </ActionIcon>
        </Group>

        <Tabs defaultValue='profile_settings'>
          <Tabs.List grow mb='xl'>
            <Tabs.Tab
              value='profile_settings'
              leftSection={<Icons.profileSettings />}
            >
              {t('profile_settings')}
            </Tabs.Tab>
            <Tabs.Tab value='app_settings' leftSection={<Icons.appSettings />}>
              {t('app_settings')}
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='profile_settings'>
            <ProfileForm user={user} />
          </Tabs.Panel>
          <Tabs.Panel value='app_settings'>
            <AppForm defaultValue={{ locale: locale as 'en' | 'ar' }} />
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
  const response = await authenticateOrToast(request);
  const t = await getTranslations(request);
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
      message: t('common.updated_successfully'),
      description: t('common.profile_updated'),
    });
  } else if (intent === INTENTS.editApp) {
    const submission = parseWithZod(formData, { schema: appSchema });
    if (submission.status !== 'success') {
      return json(submission.reply());
    }
    const userPrefsSession = await userPrefs.getSession(
      request.headers.get('Cookie')
    );
    const t = await getTranslations(request, submission.value.locale);
    userPrefsSession.set('locale', submission.value.locale);
    return redirectWithSuccess(
      '/feed',
      {
        message: t('settings.updated_successfully'),
        description: t('settings.profile_updated'),
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
        message: t('settings.profile_synced_successfully'),
        description: t('settings.profile_synced_successfully_description'),
      },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      }
    );
  }
  return null;
};
