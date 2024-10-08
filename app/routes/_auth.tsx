import { Container, AppShell, Title, Card, Tabs } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export const handle = {
  // this is important to prevent flickering
  i18n: 'common',
};

const AuthLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <AppShell
      header={{
        height: 60,
      }}
      padding='xl'
    >
      <AppShell.Main>
        <Container>
          <Tabs
            mb='xl'
            onChange={(value) => {
              navigate(`${value}`);
            }}
            defaultValue={location.pathname}
          >
            <Tabs.List grow>
              <Tabs.Tab value='/login'>{t('login')}</Tabs.Tab>
              <Tabs.Tab value='/register'>{t('register')}</Tabs.Tab>
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
