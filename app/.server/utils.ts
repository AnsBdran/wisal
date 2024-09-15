import { ITEMS_PER_PAGE } from '~/lib/constants';
import { db } from './db';
import { chats, chatMembers } from './db/schema';
import { eventStream } from 'remix-utils/sse/server';
import { emitter } from '~/services/emitter.server';

export const getPagination = ({ page }) => {
  return {
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
  };
};

export const findOrCreateChat = async (fromID: number, toID: number) => {
  const existingchat = await db.query.chats.findFirst({
    // where: (chat, { and, eq, inArray }) => {
    //   const sq = await db
    //     .select()
    //     .from(chatMembers)
    //     .where(
    //       and(eq(chatMembers.chatID, chat.id), eq(chatMembers.userID, fromID))
    //     );
    //   const sq2 = await db
    //     .select()
    //     .from(chatMembers)
    //     .where(
    //       and(eq(chatMembers.chatID, chat.id), eq(chatMembers.userID, toID))
    //     );
    //   return and(eq(sq.length, 1), eq(sq2.length, 1));
    // },
    with: {
      members: true,
    },
  });
  // const existingchat = await db.query.chats.findFirst({
  //   with: {
  //     members: {
  //       where(fields, { and, eq }) {
  //         return and(eq(fields.userID, fromID), eq(fields.userID, toID));
  //       },
  //     },
  //   },
  // });
  if (existingchat) {
    return existingchat;
  }

  const newChat = await db
    .insert(chats)
    .values({
      name: `new chat`,
    })
    .returning();

  await db.insert(chatMembers).values([
    { chatID: newChat[0].id, userID: fromID },
    { chatID: newChat[0].id, userID: toID },
  ]);

  return newChat[0];
};

export const createEventStream = (request: Request, eventName: string) => {
  return eventStream(request.signal, (send) => {
    const handle = () => {
      send({ data: String(Date.now()) });
    };
    emitter.addListener(eventName, handle);
    return () => {
      emitter.removeListener('message', handle);
    };
  });
};
