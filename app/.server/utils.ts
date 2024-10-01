import { INTENTS, ITEMS_PER_PAGE } from '~/lib/constants';
import { db } from './db';
import { chats, chatMembers, users } from './db/schema';
import { eventStream } from 'remix-utils/sse/server';
import { emitter } from '~/services/emitter.server';
import { authenticator } from '~/services/auth.server';
import i18next from '~/services/i18n.server';
import { redirectWithError, redirectWithInfo } from 'remix-toast';
import cloudinary from 'cloudinary';
import { writeAsyncIterableToWritable } from '@remix-run/node';
import { userPrefs } from '~/services/user-prefs.server';
import { UserRecord, UserSession } from '~/lib/types';
import { eq, sql } from 'drizzle-orm';
import { getFullName } from '~/lib/utils';
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';

export const getPagination = ({ page }: { page: number }) => {
  return {
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
  };
};

export const findOrCreateChat = async (fromID: number, targetID: number) => {
  // Find chats where both users are members
  const existingChats = await db.query.chats.findMany({
    with: {
      members: true,
    },
    // where: (chat, { eq }) => eq(sql`array_length(${chat.members}, 1)`, 2),
  });

  // Filter to find a chat with exactly these two users
  const privateChat = existingChats.find(
    (chat) =>
      chat.members.length === 2 &&
      chat.members.some((member) => member.userID === fromID) &&
      chat.members.some((member) => member.userID === targetID)
  );

  if (privateChat) {
    return privateChat;
  }

  // get the target user info
  const targetUser = await db
    .select()
    .from(users)
    .where(eq(users.id, targetID));

  // If no existing chat, create a new one
  const newChat = await db.transaction(async (tx) => {
    const [insertedChat] = await tx
      .insert(chats)
      .values({
        name: getFullName(targetUser[0]),
      })
      .returning();

    await tx.insert(chatMembers).values([
      { chatID: insertedChat.id, userID: fromID },
      { chatID: insertedChat.id, userID: targetID },
    ]);

    return insertedChat;
  });

  return newChat;
};

// export const findOrCreateChat = async (fromID: number, toID: number) => {
//   const existingchat = await db.query.chats.findFirst({
//     // where: (chat, { and, eq, inArray }) => {
//     //   const sq = await db
//     //     .select()
//     //     .from(chatMembers)
//     //     .where(
//     //       and(eq(chatMembers.chatID, chat.id), eq(chatMembers.userID, fromID))
//     //     );
//     //   const sq2 = await db
//     //     .select()
//     //     .from(chatMembers)
//     //     .where(
//     //       and(eq(chatMembers.chatID, chat.id), eq(chatMembers.userID, toID))
//     //     );
//     //   return and(eq(sq.length, 1), eq(sq2.length, 1));
//     // },
//     // where(fields, operators) {
//     //     return operators.and(fie)
//     // },
//     // with: {
//     //   members: {
//     //     where(fields, operators) {
//     //         return fields.
//     //     },
//     //   },
//     // },
//   });
//   // const existingchat = await db.query.chats.findFirst({
//   //   with: {
//   //     members: {
//   //       where(fields, { and, eq }) {
//   //         return and(eq(fields.userID, fromID), eq(fields.userID, toID));
//   //       },
//   //     },
//   //   },
//   // });
//   if (existingchat) {
//     return existingchat;
//   }

//   const newChat = await db
//     .insert(chats)
//     .values({
//       name: `محادثة جديدة`,
//     })
//     .returning();

//   await db.insert(chatMembers).values([
//     { chatID: newChat[0].id, userID: fromID },
//     { chatID: newChat[0].id, userID: toID },
//   ]);

//   return newChat[0];
// };

export const createEventStream = (request: Request, eventName: string) => {
  return eventStream(request.signal, (send) => {
    const handle = () => {
      send({ data: String(Date.now()) });
    };
    emitter.addListener(eventName, handle);
    return () => {
      emitter.removeListener(eventName, handle);
    };
  });
};

export const authenticateOrToast = async (request: Request) => {
  const user = await authenticator.isAuthenticated(request);
  const locale = await getUserLocale(request);

  const t = await i18next.getFixedT(locale, 'common', {
    lng: locale,
  });

  const feedRedirect = redirectWithInfo('/feed', {
    message: t('you_are_unauthorized'),
    description: t('you_are_unauthorized_description'),
  });

  const loginRedirect = redirectWithInfo('/login', {
    message: t('require_login'),
    description: t('require_login_description'),
  });

  return {
    user,
    loginRedirect,
    feedRedirect,
  };
};

export const getUserLocale = async (request: Request): Promise<'ar' | 'en'> => {
  const userPrefsSession = await userPrefs.getSession(
    request.headers.get('Cookie')
  );
  const locale = userPrefsSession.get('locale');
  return locale === 'en' ? 'en' : 'ar';
};

export const spreadRecordIntoSession = (
  userRecord: UserRecord
): UserSession => ({
  id: userRecord.id,
  role: userRecord.role,
  firstName: userRecord.firstName,
  middleName: userRecord.middleName,
  lastName: userRecord.lastName,
  username: userRecord.username,
  bio: userRecord.bio,
  email: userRecord.email,
  isApproved: userRecord.isApproved,
  isFamily: userRecord.isFamily,
  isVerified: userRecord.isVerified,
  nickname: userRecord.nickname,
  profileImage: userRecord.profileImage,
});
