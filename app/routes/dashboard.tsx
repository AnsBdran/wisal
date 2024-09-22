import { AppShell, Container, Group, Title } from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { redirectWithError } from 'remix-toast';
import Header from '~/lib/components/main/header';
import { HEADER_HEIGHT } from '~/lib/constants';
import { EditUserContextProvider } from '~/lib/contexts/edit-user';
import { authenticator } from '~/services/auth.server';
import i18next from '~/services/i18n.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const t = await i18next.getFixedT(user?.locale ?? 'ar', 'common', {
    lng: user?.locale ?? 'ar',
  });
  if (!user || user.role === 'user') {
    return redirectWithError('/feed', {
      message: t('you_are_unauthorized'),
      description: t('you_are_unauthorized_description'),
    });
  }
  return { user };
};

const Dashboard = () => {
  const { user } = useLoaderData();
  console.log('user', user);
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
            <Group>
              <Link to={'./users'}>{t('users')}</Link>
              <Link to='./'>{t('dashboard')}</Link>
            </Group>
            <Outlet />
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Dashboard;
