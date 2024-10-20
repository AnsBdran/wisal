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
} from '@mantine/core';
import { Form, Link } from '@remix-run/react';
import { Icon } from '@iconify/react';
import { UserSession } from '~/lib/types';
import styles from './header.module.css';
import { Icons, icons } from '~/lib/icons';
import Logo from '~/logo';
import { useLocale, useTranslations } from 'use-intl';

const Header = ({ user }: { user?: UserSession }) => {
  const t = useTranslations('common');
  // const { setColorScheme } = useMantineColorScheme({
  //   keepTransitions: true,
  // });
  // const computedColorScheme = useComputedColorScheme('light', {
  //   getInitialValueInEffect: true,
  // });
  return (
    <AppShellHeader zIndex={99}>
      <Container className='h-full ' size='sm'>
        <Group className='h-full justify-between'>
          <Center to='/feed' component={Link} h='100%' w={80} bg={'grapes'}>
            <Logo />
          </Center>
          <Group>
            {user ? (
              <Menu>
                <Menu.Target>
                  <Avatar />
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
                <Button variant='light' component={Link} to='/login'>
                  {t('login')}
                </Button>
              </Box>
            )}

            {/* <ActionIcon
              onClick={() => {
                setColorScheme(
                  computedColorScheme === 'light' ? 'dark' : 'light'
                );
              }}
              className={styles.themeIcon}
              variant='default'
            >
              <Icon
                icon={
                  // colorScheme === 'light'
                  // ? 'material-symbols:sunny-rounded'
                  // : 'bi:moon-stars-fill'
                  icons.colorTheme
                }
                className=''
                // color={colorScheme === 'light' ? 'gray' : 'white'}
              />
            </ActionIcon> */}
          </Group>
        </Group>
      </Container>
    </AppShellHeader>
  );
};

export default Header;
