import { parseWithZod } from '@conform-to/zod';
import { and, eq } from 'drizzle-orm';
import { redirectWithSuccess } from 'remix-toast';
import { db } from '~/.server/db';
import { chatMembers, chats } from '~/.server/db/schema';
import { chatGroupSchema } from '~/lib/schemas';

export const createChatGroup = async (fd: FormData, userID: number) => {
  const submission = parseWithZod(fd, { schema: chatGroupSchema });
  if (submission.status !== 'success') {
    console.log('everything failed', submission.error, submission.payload);
    return submission.reply();
  }
  const { members, name, bio } = submission.value;

  // create the chat
  const chat = await db
    .insert(chats)
    .values({ name, bio, creatorID: userID })
    .returning();
  members.push(userID);
  // insert the members
  await db
    .insert(chatMembers)
    .values(members.map((m) => ({ chatID: chat[0].id, userID: m })));
  return redirectWithSuccess(`/messenger/group/${chat[0].id}`, {
    message: 'chat_group_created_successfully',
    description: 'chat_group_created_successfully_description',
  });
};

export const exitChatGroup = async (fd: FormData, userID: number) => {
  const chatID = Number(fd.get('chatID'));
  try {
    const res = await db
      .delete(chatMembers)
      .where(
        and(eq(chatMembers.userID, userID), eq(chatMembers.chatID, chatID))
      );
    console.log('delete result', res);
  } catch (e) {
    console.log('something went wrong', e);
  }
  return { success: true };
};
