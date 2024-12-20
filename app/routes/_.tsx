import { AppShell, Container, Tabs, TabsList } from '@mantine/core';

import { useNavigate, Outlet, useLoaderData } from '@remix-run/react';

import Header from '~/lib/components/main/header/index';
import { LoaderFunction } from '@remix-run/node';
import {
  BOTTOM_BAR_HEIGHT,
  CONTAINER_SIZE,
  HEADER_HEIGHT,
} from '~/lib/constants';
import { Icons } from '~/lib/icons';
import { useHeadroom } from '@mantine/hooks';
import { authenticateOrToast } from '~/.server/utils';
import { startTransition } from 'react';
import { useTranslations } from 'use-intl';

export const loader: LoaderFunction = async ({ request }) => {
  const { user, loginRedirect } = await authenticateOrToast(request);
  const pathname = new URL(request.url).pathname;
  if (!user) return loginRedirect;
  return { user, pathname };
};

const MainLayout = () => {
  const { user, pathname } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const t = useTranslations('common');
  const pinned = useHeadroom({ fixedAt: HEADER_HEIGHT });
  // const location = useLocation();

  const handleTabChange = (value: string | null) => {
    if (value) {
      startTransition(() => {
        navigate(value);
      });
    }
  };
  return (
    <>
      <AppShell
        header={{
          height: HEADER_HEIGHT,
          collapsed: !pinned,
          offset: true,
        }}
        px={{ base: 0, sm: 'sm' }}
      >
        <Header user={user} />
        <AppShell.Main>
          <Container size={CONTAINER_SIZE}>
            <Outlet />
          </Container>
          <Container size={CONTAINER_SIZE} h={BOTTOM_BAR_HEIGHT} px={0}>
            <Tabs
              defaultValue={pathname === '/feed' ? '/feed' : '/messenger'}
              onChange={handleTabChange}
              style={{
                backgroundColor: 'var(--mantine-color-body)',
                width: '100%',
                marginInline: 'auto',
              }}
              inverted
              h='100%'
            >
              <TabsList h='100%'>
                <Tabs.Tab
                  flex={1}
                  value='/feed'
                  leftSection={<Icons.feed />}
                  // leftSection={<Icon icon={icons.communication} />}
                >
                  {t('communicating')}
                </Tabs.Tab>
                <Tabs.Tab
                  flex={1}
                  value='/messenger'
                  leftSection={<Icons.messenger />}
                  // leftSection={<Icons.messenger />}
                >
                  {t('messaging')}
                </Tabs.Tab>
              </TabsList>
            </Tabs>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default MainLayout;
