import { Container, Title } from '@mantine/core';
import { Outlet } from '@remix-run/react';

const AuthLayout = () => {
  return (
    <>
      <header className='bg-green-400/10 py-2 px-8'>hi</header>
      <Container>
        <Title>Auth layout</Title>
        <Outlet />
      </Container>
    </>
  );
};

export default AuthLayout;
