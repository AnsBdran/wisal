import {
  ActionIcon,
  Avatar,
  Box,
  Divider,
  Group,
  rem,
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
import { authenticator } from '~/services/auth.server';
import { Fragment } from 'react/jsx-runtime';
import {
  GroupChat,
  ChooseUserToMessage,
  CreateChatGroupButton,
  EmptyMessenger,
  DirectChat,
} from './components';
import { authenticateOrToast, findOrCreateDirectChat } from '~/.server/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { INTENTS } from '~/lib/constants';
import styles from './messenger.module.css';
import { getUserChats } from '~/.server/queries';
import { DirectChatType, GroupChatType } from '~/lib/types';
import { createChatGroup, exitChatGroup } from './actions';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  const { chats } = await getUserChats({ userID: Number(user.id) });
  return json({ chats });
};

export const handle = {
  i18n: ['common', 'messenger', 'form'],
};

const Messenger = () => {
  const { chats } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    // <Stack py='xl' >
    <>
      <Group className={styles.messengerHeader}>
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
          <Fragment key={chat.chatID}>
            {chat.type === 'group' ? (
              <GroupChat groupChat={chat as GroupChatType} />
            ) : (
              <DirectChat directChat={chat as DirectChatType} />
            )}
            <Divider />
          </Fragment>
        ))}
      </Box>

      <EmptyMessenger hidden={chats.length > 0} />
    </>
  );
};

export default Messenger;

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const userID = Number(user?.id);
  const fd = await request.formData();
  const intent = fd.get('intent');
  const targetID = Number(fd.get('targetID'));

  switch (intent) {
    case INTENTS.findOrCreateChat: {
      const chatID = await findOrCreateDirectChat(userID, targetID);
      return redirect(`/messenger/${chatID}`);
    }
    case INTENTS.createChatGroup: {
      return await createChatGroup(fd, userID);
    }
    case INTENTS.exitChatGroup: {
      return await exitChatGroup(fd, userID);
    }
  }
  return null;
};
