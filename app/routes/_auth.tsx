import { Container, AppShell } from '@mantine/core';
import { Outlet } from '@remix-run/react';
import Header from '~/lib/components/main/header/index';

const AuthLayout = () => {
  return (
    <AppShell
      header={{
        height: 60,
      }}
      padding='xl'
    >
      {/* <Header /> */}
      <AppShell.Main>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AuthLayout;
