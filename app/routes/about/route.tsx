import {
  AppShell,
  Container,
  Title,
  Button,
  Group,
  Modal,
  Stack,
  Box,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Header from '~/lib/components/main/header/index';
import { HEADER_HEIGHT } from '~/lib/constants';
import { authenticator } from '~/services/auth.server';
import styles from './about.module.css';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { Faqs, StatsGroup } from './bits';
import { db } from '~/.server/db';
import { count } from 'drizzle-orm';
import { messages, posts, users } from '~/.server/db/schema';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authUser = await authenticator.isAuthenticated(request);
  const usersCount = await db.select({ count: count() }).from(users);
  const postsCount = await db.select({ count: count() }).from(posts);
  const messagesCount = await db.select({ count: count() }).from(messages);
  return json({
    user: authUser,
    stats: {
      usersCount: usersCount[0].count,
      postsCount: postsCount[0].count,
      messagesCount: messagesCount[0].count,
    },
  });
};

const About = () => {
  const { user, stats } = useLoaderData<typeof loader>();
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: HEADER_HEIGHT }}
        padding='lg'
        footer={{
          height: 240,
        }}
      >
        <Header user={user} />
        <AppShell.Main className={styles.shellMain}>
          <Container>
            <Stack>
              <Group justify='space-between'>
                <Title>تطبيق وصال</Title>
                <Button
                  variant='outline'
                  onClick={open}
                  leftSection={<Icon icon={icons.add} />}
                >
                  تقديم اقتراح
                </Button>
              </Group>

              <Modal
                opened={opened}
                onClose={close}
                overlayProps={{
                  blur: 3,
                  backgroundOpacity: 0.4,
                }}
              >
                hi
              </Modal>
              <StatsGroup _stats={stats} />
              <Faqs />
            </Stack>
          </Container>
        </AppShell.Main>
        <AppShell.Footer p='xl' className={styles.shellFooter}>
          <Box>
            <Group>
              <Text>فكرة وتطوير</Text>
              <Text>أنس بدران</Text>
            </Group>
          </Box>
        </AppShell.Footer>
      </AppShell>
    </>
  );
};

export default About;
