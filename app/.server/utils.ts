import { ITEMS_PER_PAGE } from '~/lib/constants';
import { db } from './db';
import { directChats, directChatMembers } from './db/schema';
import { eventStream } from 'remix-utils/sse/server';
import { emitter } from '~/services/emitter.server';
import { authenticator } from '~/services/auth.server';
import { redirectWithInfo } from 'remix-toast';
import { UserRecord, UserSession } from '~/lib/types';
import { eq } from 'drizzle-orm';
import {} from 'use-intl/';
import { getTranslations } from '~/services/next-i18n';
import { getSession } from '~/services/session.server';
export const getPagination = ({ page }: { page: number }) => {
  return {
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE,
  };
};

export const findOrCreateDirectChat = async (
  fromID: number,
  targetID: number
) => {
  // const searchResult = await db
  // First, find if a direct chat already exists between the two users

  const fromChats = await db
    .select()
    .from(directChatMembers)
    .where(eq(directChatMembers.userID, fromID));
  const targetChats = await db
    .select()
    .from(directChatMembers)
    .where(eq(directChatMembers.userID, targetID));
  const commonChat = fromChats.find((fromChat) =>
    targetChats.some((targetChat) => targetChat.chatID === fromChat.chatID)
  );

  if (commonChat) return commonChat.chatID;

  const newChat = await db.insert(directChats).values({}).returning();
  await db.insert(directChatMembers).values([
    { chatID: newChat[0].id, userID: fromID },
    { chatID: newChat[0].id, userID: targetID },
  ]);
  return newChat[0].id;
};

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

  // const t = (v) => v;
  const t = await getTranslations(request);

  const feedRedirect = redirectWithInfo('/feed', {
    message: t('common.you_are_unauthorized'),
    description: t('common.you_are_unauthorized_description'),
  });

  const loginRedirect = redirectWithInfo('/login', {
    message: t('common.require_login'),
    description: t('common.require_login_description'),
  });

  return {
    user,
    loginRedirect,
    feedRedirect,
  };
};

export const updateUserSession = async (
  request: Request,
  userRecord: UserRecord
) => {
  const session = await getSession(request.headers.get('Cookie'));
  session.set(authenticator.sessionKey, spreadRecordIntoSession(userRecord));
  return session;
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
