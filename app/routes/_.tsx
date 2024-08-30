import { AppShell, Container, Tabs, TabsList } from '@mantine/core';
import { useNavigate, Outlet, useLocation } from '@remix-run/react';

import Header from '~/lib/components/main/header';
import Footer from '~/lib/components/main/footer';
import '@mantine/core/styles.css';
import { useTranslation } from 'react-i18next';
// import { useHeadroom } from '@mantine/hooks';

const MailLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const pinned = useHeadroom({ fixedAt: 120 });SS
  const location = useLocation();
  return (
    <>
      <AppShell
        header={{
          height: 60,
          // collapsed: !pinned,
          // offset: false,
        }}
        footer={{ collapsed: true, height: 120 }}
        p='sm'
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <AppShell.Main>
          <Container>
            <Tabs
              defaultValue={location.pathname}
              onChange={(value) => value && navigate(value)}
            >
              <TabsList>
                <Tabs.Tab flex={1} value='/feed'>
                  {t('communicating')}
                </Tabs.Tab>
                <Tabs.Tab flex={1} value='/messanger'>
                  {t('messaging')}
                </Tabs.Tab>
              </TabsList>
            </Tabs>
            <Outlet />
          </Container>
        </AppShell.Main>
        <AppShell.Footer>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </>
  );
};

export default MailLayout;
