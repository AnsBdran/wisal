import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Group,
  Menu,
  Title,
  useDirection,
  useMantineColorScheme,
} from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { authenticator } from '~/services/auth.server';
// import { authenticator } from '~/services/auth.server'

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//     const user = await authenticator.isAuthenticated(request)
//     return { user }
// }

// const Header = ({ user }) => {
const Header = () => {
  // const { } = useLoaderData<typeof loader>()
  // console.log('the user in header', user)
  // console.log('finally', user)
  const { i18n, t } = useTranslation();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  // const { toggleDirection } = useDirection()
  return (
    <>
      <Container className='h-full'>
        <Group className='h-full !justify-between'>
          <Link to='/'>
            <Title order={4}>{t('app_title')}</Title>
          </Link>
          <Group>
            {true ? (
              <Menu>
                <Menu.Target>
                  <Avatar />
                </Menu.Target>
                <Menu.Divider />
                <Menu.Dropdown>
                  <Form method='post' action='/logout'>
                    <Menu.Item
                      color='red'
                      component='button'
                      type='submit'
                      leftSection={<Icon icon='fluent:sign-out-20-regular' />}
                    >
                      {t('logout')}
                    </Menu.Item>
                  </Form>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Box className='gap-3 flex'>
                <Button variant='light' component={Link} to='/login'>
                  {t('login')}
                </Button>
                <Button to='/register' variant='outline' component={Link}>
                  {t('register')}
                </Button>
              </Box>
            )}

            {/* Change language menu */}
            <Menu transitionProps={{ transition: 'fade-down', duration: 120 }}>
              <Menu.Target>
                {/* i18n.language === 'ar' ? i18n.changeLanguage('en') : i18n.changeLanguage('ar') */}
                <ActionIcon>
                  <Icon icon='ic:outline-language' />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t('choose_app_language')}</Menu.Label>
                <Menu.Item
                  onClick={() => i18n.changeLanguage('ar')}
                  leftSection={<Icon icon='mdi:abjad-arabic' />}
                >
                  عربي
                </Menu.Item>
                <Menu.Item
                  onClick={() => i18n.changeLanguage('en')}
                  leftSection={<Icon icon='ri:english-input' />}
                >
                  English
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <ActionIcon onClick={toggleColorScheme}>
              <Icon
                icon={
                  colorScheme === 'light' ? 'hugeicons:sun-02' : 'bi:moon-stars'
                }
              />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </>
  );
};

export default Header;
