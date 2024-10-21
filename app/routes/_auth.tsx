import { Container, AppShell, Title, Card, Tabs } from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslations } from 'use-intl';
import { authenticateOrToast } from '~/.server/utils';
import Header from '~/lib/components/main/header';
import { Icons } from '~/lib/icons';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, feedRedirect } = await authenticateOrToast(request);
  if (user) return feedRedirect;
  return {};
};

const AuthLayout = () => {
  const t = useTranslations();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AppShell
      header={{
        height: 60,
      }}
      padding='xl'
    >
      <Header />
      <AppShell.Main>
        <Container>
          <Tabs
            mb='xl'
            onChange={(value) => {
              navigate(`${value}`);
            }}
            value={location.pathname}
          >
            <Tabs.List grow>
              <Tabs.Tab leftSection={<Icons.login />} value='/login'>
                {t('common.login')}
              </Tabs.Tab>
              <Tabs.Tab leftSection={<Icons.register />} value='/register'>
                {t('common.register')}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <Card>
            <Outlet />
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AuthLayout;
