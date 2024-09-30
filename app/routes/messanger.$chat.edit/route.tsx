import { AppShell, Container, Group, Title } from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import ChatEditForm from './chat-form';
import { HEADER_HEIGHT, INTENTS } from '~/lib/constants';
import { chatMembers, chats } from '~/.server/db/schema';
import { eq, sum } from 'drizzle-orm';
import { parseWithZod } from '@conform-to/zod';
import { chatGroupSchema } from '~/lib/schemas';
import { redirectWithSuccess } from 'remix-toast';
import i18next from '~/services/i18n.server';
import { getUserLocale } from '~/.server/utils';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { chat: chatParam } = params;
  const _chat = await db.query.chats.findFirst({
    where: (chat, { eq }) => eq(chat.id, Number(chatParam)),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });
  return json({ chat: _chat });
};

const ChatEdit = () => {
  const { chat } = useLoaderData<typeof loader>();
  const { t } = useTranslation('messanger');
  return (
    <>
      <AppShell header={{ height: HEADER_HEIGHT }} padding='xl'>
        <AppShell.Header>
          <Container h='100%'>
            <Group h='100%'>
              <Title order={4}>{chat?.name}</Title>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          <Container>
            <Title mb='xl'>{t('edit_chat')}</Title>
            <ChatEditForm chat={chat} />
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
  const chatID = Number(fd.get('chatID'));
  const userID = Number(fd.get('userID'));
  const memberID = Number(fd.get('memberID'));
  const locale = await getUserLocale(request);
  const t = await i18next.getFixedT(locale);

  switch (intent) {
    case INTENTS.removeChatMember: {
      const res = await db
        .delete(chatMembers)
        .where(eq(chatMembers.id, memberID));
      return json({ success: true });
    }
    case INTENTS.editChatGroup: {
      const chatID = Number(fd.get('chatID'));
      console.log('editing chat +++++++++++++++++ ');
      const submission = parseWithZod(fd, { schema: chatGroupSchema });
      if (submission.status !== 'success') {
        console.log('it is invalid', submission.error);
        return submission.reply();
      }

      const { members, name, bio } = submission.value;
      // submit the edit values
      await db.update(chats).set({
        bio,
        name,
      });

      // insert chat members
      await db.insert(chatMembers).values(
        members.map((m) => ({
          chatID,
          userID: m,
        }))
      );
      console.log('member added', members);

      return redirectWithSuccess(`/messanger/${chatID}`, {
        message: t('chat_group_updated_successfully'),
        description: t('chat_group_updated_successfully_description'),
      });
    }
  }
};
