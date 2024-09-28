import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  rem,
  Stack,
  Title,
} from '@mantine/core';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/.server/db';
import { authenticator } from '~/services/auth.server';
import { Fragment } from 'react/jsx-runtime';
import { Chat, ChooseUserToMessage, EmptyMessanger } from './bits';
import { authenticateOrToast, findOrCreateChat } from '~/.server/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { INTENTS } from '~/lib/constants';
import styles from './messanger.module.css';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  const chats = await db.query.chatMembers.findMany({
    with: {
      chat: {
        with: {
          members: {
            with: { user: true },
            orderBy({ joinedAt }, { asc }) {
              return [asc(joinedAt)];
            },
          },
        },
      },
    },
    where(fields, operators) {
      return operators.eq(fields.userID, user.id);
    },
  });
  return json({ chats });
};

const Messanger = () => {
  const { chats } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    // <Stack py='xl' >
    <>
      <Group className={styles.messangerHeader}>
        <Group>
          <Icon icon={icons.chats} width={rem('24px')} height={rem('24px')} />
          <Title order={2}>{t('chats')}</Title>
        </Group>
        <Group>
          <ChooseUserToMessage>
            <ActionIcon variant='white' color='teal'>
              <Icon icon={icons.addChat} />
            </ActionIcon>
          </ChooseUserToMessage>
          <ActionIcon variant='white' color='teal'>
            <Icon icon={icons.usersGroup} />
          </ActionIcon>
        </Group>
      </Group>
      <Box hidden={chats.length === 0}>
        {chats.map((chat) => (
          <Fragment key={chat.id}>
            <Chat chat={chat} />
            <Divider />
          </Fragment>
        ))}
      </Box>

      <EmptyMessanger hidden={chats.length > 0} />
    </>
    // </Stack>
  );
};

export default Messanger;

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const userID = Number(user?.id);
  const fd = await request.formData();
  const intent = fd.get('intent');
  const targetID = Number(fd.get('targetID'));

  switch (intent) {
    case INTENTS.findOrCreateChat: {
      const chat = await findOrCreateChat(userID, targetID);
      return redirect(`/messanger/${chat.id}`);
      // console.log('found', chat);
    }
  }
  return null;
};
