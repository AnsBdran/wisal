import {
  ActionIcon,
  AppShell,
  Container,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { ChatEditForm, ChatMembers } from './chat-form';
import { HEADER_HEIGHT, INTENTS } from '~/lib/constants';
import { chatMembers, chats } from '~/.server/db/schema';
import { eq } from 'drizzle-orm';
import { parseWithZod } from '@conform-to/zod';
import { chatGroupSchema } from '~/lib/schemas';
import { redirectWithSuccess } from 'remix-toast';
import { authenticateOrToast } from '~/.server/utils';
import Header from '~/lib/components/main/header';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { useTranslations } from 'use-intl';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // const { chat: chatParam } = params;
  const chatID = params.chat!;
  const { user, loginRedirect } = await authenticateOrToast(request);
  if (!user) return loginRedirect;
  // const type = params.type;
  // if (type === 'group') {
  const _chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => eq(chat.id, chatID),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });
  return json({ chat: _chat, user });
  // } else if (type === 'direct') {
  //   const _chat = await db.query.directChats.findFirst({
  //     where: (chat, { eq }) => eq(chat.id, chatID),
  //     with: {
  //       members: {
  //         with: {
  //           user: true,
  //         },
  //       },
  //     },
  //   });
  //   return json({ chat: _chat, user });
  // }
};

export const handle = {
  i18n: ['common', 'messenger', 'form'],
};

const ChatEdit = () => {
  const { chat, user } = useLoaderData<typeof loader>();
  const t = useTranslations('messenger');
  const navigate = useNavigate();
  return (
    <>
      <AppShell
        header={{ height: HEADER_HEIGHT }}
        padding={{ base: '0px', sm: 'xs', md: 'md' }}
      >
        <AppShell.Header>
          <Container h='100%'>
            <Header user={user} />
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Container>
            <Stack>
              <Group>
                <ActionIcon variant='subtle' onClick={() => navigate(-1)}>
                  <Icon icon={icons.arrow} />
                </ActionIcon>
                <Title>{t('edit_chat')}</Title>
              </Group>
              <ChatEditForm chat={chat} />
              <ChatMembers chat={chat} />
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default ChatEdit;

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const intent = fd.get('intent');
  const chatID = fd.get('chatID') as string;
  const userID = Number(fd.get('userID'));
  const memberID = Number(fd.get('memberID'));
  const t = (t) => t;
  switch (intent) {
    case INTENTS.removeChatMember: {
      const res = await db
        .delete(chatMembers)
        .where(eq(chatMembers.id, memberID));
      return json({ success: true });
    }
    case INTENTS.editChatGroup: {
      console.log('editing chat +++++++++++++++++ ');
      const submission = parseWithZod(fd, { schema: chatGroupSchema });
      if (submission.status !== 'success') {
        console.log('it is invalid', submission.error);
        return submission.reply();
      }
      console.log('submission ++++++', submission);
      const { members, name, bio } = submission.value;
      // submit the edit values
      await db
        .update(chats)
        .set({
          bio,
          name,
        })
        .where(eq(chats.id, chatID));

      // insert chat members
      if (members.length > 0) {
        await db.insert(chatMembers).values(
          members.map((m) => ({
            chatID,
            userID: m,
          }))
        );
      }
      console.log('member added', members);

      return redirectWithSuccess(`/messenger/${chatID}`, {
        message: t('chat_group_updated_successfully'),
        description: t('chat_group_updated_successfully_description'),
      });
    }
  }
};
