import { Title, Button, Group, Stack } from '@mantine/core';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { Faqs, InProgressFeatures, StatsGroup } from './components';
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
        <Button component={Link} to='/suggestions'>
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
