import { AppShell, Box, Container, rem, Stack } from '@mantine/core';
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { getChatData } from '~/.server/queries';
import Header from '~/lib/components/main/header/index';
import {
  HEADER_HEIGHT,
  INTENTS,
  MESSANGER_FOOTER_HEIGHT,
  MESSANGER_HEADER_HEIGHT,
} from '~/lib/constants';
import { authenticator } from '~/services/auth.server';
import styles from './chat.module.css';
import { ReactNode, useEffect, useRef } from 'react';
import { User } from '~/lib/types';
import { ChatFooter, ChatHeader, Message } from './bits';
import { db } from '~/.server/db';
import { messages } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { emitter } from '~/services/emitter.server';
import { useLiveLoader } from '~/lib/hooks/useLiveLoader';
import { authenticateOrToast } from '~/.server/utils';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;
  const chat = await getChatData({ chatID: Number(params.chat) });
  return json({ user, chat });
};

const Chat = () => {
  const { user, chat } = useLiveLoader<typeof loader>();

  const chatEndRef = useRef<HTMLElement>(null);
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
        <Box h={rem(MESSANGER_HEADER_HEIGHT)} className={styles.chatHeader}>
          <ChatHeader chat={chat.data} />
        </Box>

        <Stack id='messages_chat' className={styles.messagesContainer}>
          <div ref={chatEndRef}></div>
          {chat.messages.map((m, idx) => (
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
        <Box h={rem(MESSANGER_FOOTER_HEIGHT)} className={styles.chatFooter}>
          <ChatFooter chatID={chat.data.id} />
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
  user: User;
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

  if (!userID) return new Response(null, { status: 404 });
  const formData = await request.formData();
  const chatID = Number(formData.get('chatID'));
  const intent = formData.get('intent');
  const content = String(formData.get('content'));
  const messageID = formData.get('messageID');

  switch (intent) {
    case INTENTS.sendMessage: {
      if (!chatID) return;
      await db.insert(messages).values({
        chatID,
        content,
        senderID: userID,
      });
      emitter.emit(params.chat!);
      return json({ action: 'added' });
    }
    case INTENTS.editMessage: {
      await db
        .update(messages)
        .set({ content })
        .where(eq(messages.id, messageID));
      emitter.emit(params.chat!);
      return null;
    }
    case INTENTS.deleteMessage: {
      await db.delete(messages).where(eq(messages.id, messageID));
      emitter.emit(params.chat!);
    }
  }
  return { foo: 'bar' };
};
