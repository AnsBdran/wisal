import { Container, Title, AppShell } from '@mantine/core';
import { Outlet } from '@remix-run/react';
import Header from '~/lib/components/main/header';

const AuthLayout = () => {
  return (
    <AppShell
      header={{
        height: 60,
      }}
    >
      <Header />
      <AppShell.Main>
        <Container>
          <Title>Auth layout</Title>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default AuthLayout;
