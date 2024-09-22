import { Icon } from '@iconify/react';
import {
  ActionIcon,
  AppShell,
  Box,
  Group,
  Stack,
  Container,
  Text,
  Title,
  Divider,
} from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { json, Outlet, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticateOrToast } from '~/.server/utils';
import Header from '~/lib/components/main/header';
import { HEADER_HEIGHT } from '~/lib/constants';
import { icons } from '~/lib/icons';
import styles from './l.module.css';
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  return json({ user });
};

const MainLayout = () => {
  const { user } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  return (
    <>
      <AppShell header={{ height: HEADER_HEIGHT }} padding={'sm'}>
        <Header user={user} />
        <AppShell.Main className={styles.shellMain}>
          <Container>
            <Outlet />
          </Container>
        </AppShell.Main>
        <AppShell.Footer p='xl' className={styles.shellFooter}>
          <Container h='100%'>
            <Stack justify='space-between' h='100%'>
              <Group>
                <Stack gap='xs'>
                  <Title order={3} fz='h2'>
                    {t('app_title')}
                  </Title>
                  <Text color='dimmed' fz='sm'>
                    تواصل وتراسل مع أصدقائك وأحبابك.
                  </Text>
                </Stack>
              </Group>
              <Box>
                <Divider />
                <Group mt='md'>
                  <Text c='dimmed' className='highlighted'>
                    فكرة وتطوير: <Text span>أنس بدران</Text>
                  </Text>
                  <ActionIcon variant='transparent'>
                    <Icon icon={icons.github} />
                  </ActionIcon>
                  <ActionIcon variant='gradient'>
                    <Icon icon={icons.telegram} />
                  </ActionIcon>
                  <ActionIcon variant='transparent'>
                    <Icon icon={icons.whatsapp} />
                  </ActionIcon>
                </Group>
              </Box>
            </Stack>
          </Container>
        </AppShell.Footer>
      </AppShell>
    </>
  );
};

export default MainLayout;
