import {
  ActionIcon,
  AppShellHeader,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Group,
  Image,
  Menu,
  ThemeIcon,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { Form, Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { UserRecord, UserSession } from '~/lib/types';
import styles from './header.module.css';
import { icons } from '~/lib/icons';
// import Logo from '/favicon.svg';
import Logo from '~/logo';

const Header = ({ user }: { user?: UserSession }) => {
  const { i18n, t } = useTranslation();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  return (
    <AppShellHeader zIndex={99}>
      <Container className='h-full '>
        <Group className='h-full justify-between'>
          <Center to='/feed' component={Link} h='100%' w={80} bg={'grapes'}>
            {/* <Image
              src='/logo.svg'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            /> */}
            <Logo />
            {/* <Title order={4}>{t('app_title')}</Title> */}
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
                    leftSection={<Icon icon={icons.profile} />}
                  >
                    {t('profile')}
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to='/about'
                    leftSection={<Icon icon={icons.info} />}
                  >
                    {t('about_app')}
                  </Menu.Item>
                  <Menu.Item
                    component={Link}
                    to='/settings'
                    leftSection={<Icon icon={icons.settings} />}
                  >
                    {t('settings')}
                  </Menu.Item>
                  <Menu.Item
                    hidden={user.role === 'user'}
                    variant='outline'
                    component={Link}
                    to='/dashboard'
                    leftSection={<Icon icon={icons.dashboard} />}
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
                        leftSection={<Icon icon={icons.exit} />}
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
                {/* <Button to='/register' variant='outline' component={Link}>
                  {t('register')}
                </Button> */}
              </Box>
            )}

            <ActionIcon
              onClick={toggleColorScheme}
              className={styles.themeIcon}
              variant='default'
            >
              <Icon
                icon={
                  colorScheme === 'light'
                    ? 'material-symbols:sunny-rounded'
                    : 'bi:moon-stars-fill'
                }
                className=''
                // color={colorScheme === 'light' ? 'gray' : 'white'}
              />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </AppShellHeader>
  );
};

export default Header;
