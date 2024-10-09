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
  Badge,
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
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  return json({ user });
};

export const handle = {
  i18n: 'common',
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
                  <Group>
                    <Title order={3} fz='h2'>
                      {t('app_title')}
                    </Title>
                    <Badge size='xs' variant='dot'>
                      نسخة تجريبية
                    </Badge>
                  </Group>
                  <Text color='dimmed' fz='sm'>
                    تواصل وتراسل مع أصدقائك وأحبابك.
                  </Text>
                </Stack>
              </Group>
              <Box>
                <Divider />
                <Group mt='md' justify='space-between'>
                  {/* <Group  gap='xs' > */}
                  <Text className='highlighted' c='dimmed' fz='xs'>
                    فكرة وتطوير: {/* <Icon icon={icons.leftArrow} /> */}
                    <span>أنس بدران</span>
                  </Text>
                  {/* <Icon icon={icons.starBadge} /> */}

                  {/* </Group> */}
                  <Group gap={'xs'}>
                    <ActionIcon
                      variant='subtle'
                      component='a'
                      target='_blank'
                      href='https://github.com/ansbdran'
                    >
                      <Icon icon={icons.github} />
                    </ActionIcon>
                    <ActionIcon
                      variant='subtle'
                      component='a'
                      target='_blank'
                      href='https://t.me/AnsBdran'
                    >
                      <Icon icon={icons.telegram} />
                    </ActionIcon>
                    <ActionIcon
                      variant='subtle'
                      component='a'
                      target='_blank'
                      href='https://wa.me/+970597866163'
                    >
                      <Icon icon={icons.whatsapp} />
                    </ActionIcon>
                  </Group>
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
