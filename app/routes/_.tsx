import {
  AppShell,
  Box,
  Container,
  Tabs,
  TabsList,
  useMantineTheme,
} from '@mantine/core';

import {
  useNavigate,
  Outlet,
  useLocation,
  useLoaderData,
} from '@remix-run/react';

import Header from '~/lib/components/main/header/index';
import Footer from '~/lib/components/main/footer';
import { useTranslation } from 'react-i18next';
import { LoaderFunction } from '@remix-run/node';
import { BOTTOM_BAR_HEIGHT, HEADER_HEIGHT } from '~/lib/constants';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { useHeadroom } from '@mantine/hooks';
import { authenticateOrToast } from '~/.server/utils';
import { useUserSessionContext } from '~/lib/contexts/user-session';
import { useEffect } from 'react';

export const loader: LoaderFunction = async ({ request }) => {
  const { user, loginRedirect } = await authenticateOrToast(request);
  if (!user) return loginRedirect;
  return { user };
};

export const handle = {
  i18n: 'common',
};

const MailLayout = () => {
  const { user } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pinned = useHeadroom({ fixedAt: HEADER_HEIGHT });
  const location = useLocation();
  const theme = useMantineTheme();
  return (
    <>
      <AppShell
        header={{
          height: HEADER_HEIGHT,
          collapsed: !pinned,
          offset: true,
        }}
        // footer={{ collapsed: true, height: 120 }}
        px={{ base: 0, sm: 'sm' }}
        // py='lg'
      >
        <Header user={user} />
        <AppShell.Main>
          <Outlet />
          <Container size='sm'>
            <Tabs
              defaultValue={location.pathname}
              onChange={(value) => value && navigate(value)}
              style={{
                // position: 'fixed',
                // bottom: 0,
                // left: 0,
                // right: 0,
                backgroundColor: 'var(--mantine-color-body',
                // maxWidth: 'var(--container-size-sm)',
                width: '100%',
                marginInline: 'auto',
              }}
              // top={1}
              inverted
            >
              <TabsList h={BOTTOM_BAR_HEIGHT}>
                <Tabs.Tab
                  flex={1}
                  value='/feed'
                  leftSection={<Icon icon={icons.communication} />}
                >
                  {t('communicating')}
                </Tabs.Tab>
                <Tabs.Tab
                  flex={1}
                  value='/messenger'
                  leftSection={<Icon icon={icons.messaging} />}
                >
                  {t('messaging')}
                </Tabs.Tab>
              </TabsList>
            </Tabs>
          </Container>
        </AppShell.Main>
        {/* <AppShell.Footer>
          <Footer />
        </AppShell.Footer> */}
      </AppShell>
    </>
  );
};

export default MailLayout;
