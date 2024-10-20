import { Icon } from '@iconify/react/dist/iconify.js';
import { AppShell, Container, Group, Tabs } from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import { useTranslations } from 'use-intl';
import { authenticateOrToast } from '~/.server/utils';
import Header from '~/lib/components/main/header';
import { HEADER_HEIGHT } from '~/lib/constants';
import { EditSuggestionContextProvider } from '~/lib/contexts/edit-suggestion';
import { EditUserContextProvider } from '~/lib/contexts/edit-user';
import { Icons, icons } from '~/lib/icons';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect, feedRedirect } = await authenticateOrToast(
    request
  );
  if (!user) return loginRedirect;
  if (user.role === 'user') return feedRedirect;
  return { user };
};

export const handle = {
  i18n: ['dashboard', 'common'],
};

const Dashboard = () => {
  const { user } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const t = useTranslations('common');
  return (
    <>
      <AppShell
        header={{
          height: HEADER_HEIGHT,
        }}
        padding={'sm'}
      >
        <Header user={user} />
        <AppShell.Main>
          <Container>
            <Tabs
              mb={'xl'}
              onChange={(value) => value && navigate(value)}
              defaultValue={pathname}
            >
              <Tabs.List grow>
                <Tabs.Tab leftSection={<Icons.settings />} value='/dashboard'>
                  {t('dashboard')}
                </Tabs.Tab>
                <Tabs.Tab
                  leftSection={<Icons.users />}
                  value='/dashboard/users'
                >
                  {t('users')}
                </Tabs.Tab>
                <Tabs.Tab
                  value='/dashboard/suggestions'
                  leftSection={<Icons.idea />}
                >
                  {t('suggestions')}
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <EditSuggestionContextProvider>
              <EditUserContextProvider>
                <Outlet />
              </EditUserContextProvider>
            </EditSuggestionContextProvider>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Dashboard;
