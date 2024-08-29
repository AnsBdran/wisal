import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Group,
  Menu,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { Form, Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
const Header = () => {
  const { i18n, t } = useTranslation();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
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
                <Menu.Dropdown>
                  <Menu.Item>{t('settings')}</Menu.Item>
                  <Menu.Divider />
                  <Form method='post' action='/logout'>
                    <Center>
                      <Menu.Item
                        color='red'
                        component='button'
                        type='submit'
                        leftSection={<Icon icon='fluent:sign-out-20-regular' />}
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
                <Button to='/register' variant='outline' component={Link}>
                  {t('register')}
                </Button>
              </Box>
            )}
            {/* ==================================================================== */}
            {/* ==================================================================== */}
            {/* Change language menu */}
            <Menu transitionProps={{ transition: 'skew-up', duration: 120 }}>
              <Menu.Target>
                {/* i18n.language === 'ar' ? i18n.changeLanguage('en') : i18n.changeLanguage('ar') */}
                <ActionIcon>
                  <Icon icon='lets-icons:globe-light' />
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
                  onClick={() => i18n.loadLanguages('ar')}
                  // onClick={() => i18n.changeLanguage('en')}
                  leftSection={<Icon icon='ri:english-input' />}
                >
                  English
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <ActionIcon onClick={toggleColorScheme}>
              <Icon
                icon={
                  colorScheme === 'light'
                    ? 'lets-icons:sunlight-light'
                    : 'lets-icons:moon-light'
                }
                className='rotate-[210deg]'
              />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </>
  );
};

export default Header;
