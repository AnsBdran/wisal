import {
  ActionIcon,
  Divider,
  Group,
  rem,
  ScrollArea,
  Stack,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  ActionFunctionArgs,
  defer,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
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
import { BOTTOM_BAR_HEIGHT, HEADER_HEIGHT, INTENTS } from '~/lib/constants';
import styles from './messenger.module.css';
import { getUserChats } from '~/.server/queries';
import { DirectChatType, GroupChatType } from '~/lib/types';
import { createChatGroup, exitChatGroup } from './actions';
import { Suspense } from 'react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  const chats = getUserChats({ userID: Number(user.id) });
  // const { chats } = await getUserChats({ userID: Number(user.id) });
  return defer({ chats });
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
      <Stack
        className={styles.messengerContainer}
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px - ${BOTTOM_BAR_HEIGHT}px)`,
          overflow: 'hidden',
        }}
        py='xs'
        gap={0}
      >
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
        <ScrollArea
          h='100%'
          styles={{
            thumb: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Suspense fallback={<p>loading...</p>}>
            <Await resolve={chats}>
              {(chats) => (
                <>
                  {chats.chats.map((chat) => (
                    <Fragment key={chat.chatID}>
                      {chat.type === 'group' ? (
                        <GroupChat groupChat={chat as GroupChatType} />
                      ) : (
                        <DirectChat directChat={chat as DirectChatType} />
                      )}
                      <Divider />
                    </Fragment>
                  ))}
                  <EmptyMessenger hidden={chats.chats.length > 0} />
                </>
              )}
            </Await>
          </Suspense>
        </ScrollArea>
      </Stack>
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
