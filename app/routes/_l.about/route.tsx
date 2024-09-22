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
  Divider,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import Header from '~/lib/components/main/header/index';
import { HEADER_HEIGHT } from '~/lib/constants';
import { authenticator } from '~/services/auth.server';
import styles from './about.module.css';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { Faqs, InProgressFeatures, StatsGroup } from './bits';
import { db } from '~/.server/db';
import { count } from 'drizzle-orm';
import { messages, posts, users } from '~/.server/db/schema';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Stack>
      <Group justify='space-between'>
        <Title>تطبيق وصال</Title>
        <Button component={Link} to={'/suggestions'}>
          {t('view_suggestions')}
        </Button>
      </Group>

      <Stack gap={'xl'}>
        <StatsGroup _stats={stats} />
        <InProgressFeatures />
        <Faqs />
      </Stack>
    </Stack>
  );
};

export default About;
