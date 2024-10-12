import { AppShell, Box, Container, rem, Stack, Text } from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { getChatData } from '~/.server/queries';
import Header from '~/lib/components/main/header/index';
import {
  HEADER_HEIGHT,
  INTENTS,
  MESSENGER_FOOTER_HEIGHT,
  MESSENGER_HEADER_HEIGHT,
} from '~/lib/constants';
import { authenticator } from '~/services/auth.server';
import styles from './chat.module.css';
import { ReactNode, useEffect, useRef } from 'react';
import { ChatFooter, ChatHeader, Message } from './components';
import { db } from '~/.server/db';
import { messages } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { emitter } from '~/services/emitter.server';
import { useLiveLoader } from '~/lib/hooks/useLiveLoader';
import { authenticateOrToast } from '~/.server/utils';
import { UserSession } from '~/lib/types';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  useRouteError,
} from '@remix-run/react';
import { editMessage, sendMessage } from './actions';
import { waiit } from '~/lib/utils';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;
  // const type = String(params.type);
  // TODO: handle invalid IDs or types
  // if (type !== 'group' && type !== 'direct') {
  //   throw new Response(null, { status: 404, statusText: 'not found' });
  // }
  const chat = await getChatData({
    chatID: params.chat!,
    // type: type as 'group' | 'direct',
  });
  // if (!chat) {
  //   throw new Response(null, { status: 404, statusText: 'Not Found' });
  // }
  return json({ user, chat });
};

const Chat = () => {
  const { user, chat } = useLiveLoader<typeof loader>();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const isSameSenderAsNext = (m, idx) =>
    idx < chat.messages.length - 1 &&
    chat.messages[idx + 1].senderID === m.senderID;
  const isSameSenderAsPrevious = (m, idx) =>
    idx > 0 && chat.messages[idx - 1].senderID === m.senderID;
  return (
    <ChatLayout user={user}>
      {/* {data} */}
      <Stack
        className={styles.chatContainer}
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
        gap={0}
      >
        {/* chat header */}
        <Box
          h={rem(MESSENGER_HEADER_HEIGHT)}
          className={`${styles.chatHeader} ${
            chat.type === 'group'
              ? styles.chatGroupHeader
              : styles.chatDirectHeader
          }`}
        >
          <ChatHeader chat={chat} userID={user.id} />
        </Box>

        <Stack id='messages_chat' className={styles.messagesContainer}>
          <div ref={chatEndRef}></div>
          {chat?.messages.map((m, idx) => (
            <Message
              key={m.id}
              m={m}
              user={user}
              isSameSenderAsNext={isSameSenderAsPrevious(m, idx)}
              isSameSenderAsPrevious={isSameSenderAsNext(m, idx)}
            />
          ))}
        </Stack>
        <ElementScrollRestoration
          elementQuery='#messages_chat'
          key={chat.data.id}
          nonce=''
        />

        {/* chat footer */}
        <Box
          h={rem(MESSENGER_FOOTER_HEIGHT)}
          className={`${styles.chatFooter} ${
            chat.type === 'group'
              ? styles.chatGroupFooter
              : styles.chatDirectFooter
          }`}
        >
          <ChatFooter chatID={chat.data.id} chatType={chat.type} />
        </Box>
      </Stack>
    </ChatLayout>
  );
};

export default Chat;

const ChatLayout = ({
  children,
  user,
}: {
  children: ReactNode;
  user: UserSession;
}) => {
  return (
    <AppShell header={{ height: HEADER_HEIGHT }}>
      <Header user={user} />
      <AppShell.Main>
        <Container p={0}>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userID = (await authenticator.isAuthenticated(request))?.id;
  if (!userID) {
    return new Response(null, { status: 404 });
  }
  const fd = await request.formData();
  const intent = fd.get('intent');
  const messageID = Number(fd.get('messageID'));
  switch (intent) {
    case INTENTS.sendMessage: {
      return await sendMessage(fd, userID, params);
    }
    case INTENTS.editMessage: {
      // await waiit(3000);
      return await editMessage(fd, params);
    }
    case INTENTS.deleteMessage: {
      await db.delete(messages).where(eq(messages.id, messageID));
      emitter.emit(params.chat!);
    }
  }
  return { foo: 'bar' };
};
