import { Container, AppShell, Title, Card, Tabs } from '@mantine/core';
import { Outlet, useLocation, useNavigate } from '@remix-run/react';
import { useTranslations } from 'use-intl';

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
              <Tabs.Tab value='/login'>{t('common.login')}</Tabs.Tab>
              <Tabs.Tab value='/register'>{t('common.register')}</Tabs.Tab>
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
