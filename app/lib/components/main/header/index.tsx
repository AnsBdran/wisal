import {
  ActionIcon,
  AppShellHeader,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Group,
  Menu,
  useMantineColorScheme,
} from '@mantine/core';
import { Form, Link, useLocation } from '@remix-run/react';
import { UserSession } from '~/lib/types';
import styles from './header.module.css';
import { Icons } from '~/lib/icons';
import Logo from '~/logo';
import { useLocale, useTranslations } from 'use-intl';
import { getFullName } from '~/lib/utils';
import { CONTAINER_SIZE } from '~/lib/constants';

const Header = ({ user }: { user?: UserSession }) => {
  const t = useTranslations('common');
  const { toggleColorScheme } = useMantineColorScheme();
  const { pathname } = useLocation();
  return (
    <AppShellHeader zIndex={99}>
      <Container className='h-full ' size={CONTAINER_SIZE}>
        <Group className='h-full justify-between'>
          <Center to='/feed' component={Link} h='100%' w={80} bg={'grapes'}>
            <Logo />
          </Center>
          <Group>
            {user ? (
              <Menu>
                <Menu.Target>
                  <Avatar
                    color='initials'
                    src={user.profileImage}
                    name={getFullName(user)}
                    className={styles.avatar}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    to='/profile'
                    leftSection={<Icons.profile />}
                  >
                    {t('profile')}
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to='/about'
                    leftSection={<Icons.info />}
                  >
                    {t('about_app')}
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to='/settings'
                    leftSection={<Icons.settings />}
                  >
                    {t('settings')}
                  </Menu.Item>
                  <Menu.Item
                    hidden={user.role === 'user'}
                    variant='outline'
                    component={Link}
                    to='/dashboard'
                    leftSection={<Icons.controlPanel />}
                  >
                    {t('dashboard')}
                  </Menu.Item>
                  <Menu.Divider />
                  <Form method='post' action='/logout'>
                    <Center>
                      <Menu.Item
                        color='red'
                        component='button'
                        type='submit'
                        leftSection={<Icons.logout />}
                      >
                        {t('logout')}
                      </Menu.Item>
                    </Center>
                  </Form>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Box className='gap-3 flex'>
                <Button
                  hidden={pathname === '/login'}
                  variant='light'
                  component={Link}
                  to='/login'
                >
                  {t('login')}
                </Button>
              </Box>
            )}

            <ActionIcon
              onClick={toggleColorScheme}
              className={styles.themeIcon}
              variant='default'
            >
              <Icons.sun className={styles.sun} />
              <Icons.moon className={styles.moon} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </AppShellHeader>
  );
};

export default Header;
