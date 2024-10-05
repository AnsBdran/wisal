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
  Params,
  Scripts,
  useRouteError,
} from '@remix-run/react';

export const sendMessage = async (
  fd: FormData,
  userID: number,
  params: Params
) => {
  const contentType = String(fd.get('contentType'));
  const chatType = String(fd.get('chatType')) === 'group' ? 'group' : 'direct';
  const chatID = Number(fd.get('chatID'));
  console.log('trying to send ++++++++++++++++++++++++==');
  if (!chatID) return;
  if (contentType === 'text') {
    const content = String(fd.get('content'));
    await db.insert(messages).values({
      chatID,
      content,
      senderID: userID,
      contentType: 'text',
      chatType,
    });
    return { success: true };
  } else if (contentType === 'image') {
    // console.log('content', content);
    const images = JSON.parse(fd.get('content') as string) as string[];
    await db.insert(messages).values(
      images.map((imageUrl) => ({
        chatID,
        chatType: chatType,
        content: imageUrl,
        senderID: userID,
        contentType: 'image',
      })) as []
    );
  }
  emitter.emit(`${params.chat}-${params.type}`);
  return json({ action: 'added' });
};

export const editMessage = async (fd: FormData, params: Params) => {
  const messageID = Number(fd.get('messageID'));

  const content = String(fd.get('content'));
  await db.update(messages).set({ content }).where(eq(messages.id, messageID));
  emitter.emit(`${params.chat}-${params.type}`);
  return { success: true };
};
