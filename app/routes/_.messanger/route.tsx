import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  rem,
  Stack,
  ThemeIcon,
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
import {
  Chat,
  ChooseUserToMessage,
  CreateChatGroupButton,
  EmptyMessanger,
} from './bits';
import { authenticateOrToast, findOrCreateChat } from '~/.server/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { INTENTS } from '~/lib/constants';
import styles from './messanger.module.css';
import { parseWithZod } from '@conform-to/zod';
import { chatGroupSchema } from '~/lib/schemas';
import { chatMembers, chats } from '~/.server/db/schema';
import { redirectWithSuccess } from 'remix-toast';
import { and, eq } from 'drizzle-orm';

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
          <ThemeIcon
            color='teal'
            variant='transparent'
            w={rem('24px')}
            h={rem('24px')}
          >
            <Icon icon={icons.chats} />
          </ThemeIcon>
          <Title order={2}>{t('chats')}</Title>
        </Group>
        <Group>
          <ChooseUserToMessage>
            <ActionIcon variant='white' color='teal'>
              <Icon icon={icons.addChat} />
            </ActionIcon>
          </ChooseUserToMessage>
          <CreateChatGroupButton />
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
    case INTENTS.createChatGroup: {
      const submission = parseWithZod(fd, { schema: chatGroupSchema });
      if (submission.status !== 'success') {
        console.log('everything failed', submission.error, submission.payload);
        return submission.reply();
      }
      const { members, name, bio } = submission.value;

      // create the chat
      const chat = await db.insert(chats).values({ name, bio }).returning();
      members.push(userID);
      // insert the members
      await db
        .insert(chatMembers)
        .values(members.map((m) => ({ chatID: chat[0].id, userID: m })));
      return redirectWithSuccess(`/messanger/${chat[0].id}`, {
        message: 'chat_group_created_successfully',
        description: 'chat_group_created_successfully_description',
      });
    }
    case INTENTS.exitChatGroup: {
      const chatID = Number(fd.get('chatID'));
      console.log('we are trying to delete ++++++++++++++++');
      await db
        .delete(chatMembers)
        .where(
          and(eq(chatMembers.userID, userID), eq(chatMembers.chatID, chatID))
        );
      return { success: true };
    }
  }
  return null;
};
