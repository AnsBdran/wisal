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
import { useTranslation } from 'react-i18next';
import { authenticateOrToast, getUserLocale } from '~/.server/utils';
import Header from '~/lib/components/main/header';
import { HEADER_HEIGHT } from '~/lib/constants';
import { icons } from '~/lib/icons';

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
  console.log('in dashboard, user is ', user);
  console.log('user', user);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
                <Tabs.Tab
                  leftSection={<Icon icon={icons.users} />}
                  value='/dashboard/users'
                >
                  {t('users')}
                </Tabs.Tab>
                <Tabs.Tab
                  leftSection={<Icon icon={icons.dashboard} />}
                  value='/dashboard'
                >
                  {t('dashboard')}
                </Tabs.Tab>
                <Tabs.Tab value='/dashboard/suggestions'>
                  {t('suggestions')}
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Outlet />
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Dashboard;
