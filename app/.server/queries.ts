import { count } from 'drizzle-orm';
import { db } from './db';
import { posts, suggestions } from './db/schema';
import { getPagination } from './utils';
import { ChatType, MessagesWithSender } from '~/lib/types';
import { waiit } from '~/lib/utils';

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const getChatMessages = async ({
  id,
}: // type,
{
  id: string;
  // type: 'group' | 'direct';
}) => {
  // if (type === 'group') {
  const messages = await db.query.messages.findMany({
    where({ chatID, chatType }, { eq, and }) {
      return eq(chatID, id);
    },
    with: {
      sender: true,
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
    },
    limit: 50,
  });

  return messages;
  // const messages = await db.query.messages.findMany({
  //   where: ({ chatType, chatID }, { eq, and }) => eq(chatID, id)
  //   with: {
  //     sender: true,
  //   },
  //   orderBy(fields, operators) {
  //     return operators.desc(fields.createdAt);
  //   },
  //   limit: 50,
  // });
  // return messages;
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const getPosts = async ({
  page,
  userID,
}: // tag,
// searchQueries,
{
  page: number;
  // tag: string;
  userID: number;
  // searchQueries: Record<string, string>;
}) => {
  const { limit, offset } = getPagination({ page });
  const _posts = await db.query.posts.findMany({
    with: {
      comments: {
        with: {
          reactions: {
            with: {
              user: true,
            },
          },
          user: true,
        },
        limit: 5,
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
      },
      reactions: {
        with: {
          user: true,
        },
        where(fields, operators) {
          return operators.eq(fields.userID, userID);
        },
      },
      user: true,
      images: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    limit,
    offset,
    orderBy: ({ createdAt }, { desc, asc }) => desc(createdAt),
    // orderBy(fields, operators) {
    //   // return operators.desc(fields.createdAt);
    //   if (searchQueries.orderBy === 'reactions') {
    //     if (searchQueries.order === 'asce') {
    //       return operators.asc(fields.)
    //     }
    //     // return operators
    //   }
    // },
  });
  const _count = (await db.select({ count: count() }).from(posts))[0].count;
  return { data: _posts, count: _count };
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// type: 'group' | 'direct';
// : Promise<{
//   messages: MessagesWithSender;
//   data: ChatType;
//   type: 'group' | 'direct';
// }>
export const getChatData = async ({
  chatID,
}: // type,
{
  chatID: string;
}) => {
  const messages = await getChatMessages({ id: chatID });

  // if (type === 'group') {
  const groupChat = await db.query.chats.findFirst({
    where({ id }, { eq }) {
      return eq(id, chatID);
    },
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });
  // if (!chat)
  //   throw new Response(null, { status: 404, statusText: 'not found' });
  // return { messages, data: chat };
  // } else {
  if (groupChat) {
    return { messages, data: groupChat, type: 'group' };
  } else {
    const directChat = await db.query.directChats.findFirst({
      where: ({ id }, { eq }) => eq(id, chatID),
      with: {
        members: {
          with: { user: true },
        },
      },
    });
    if (!directChat) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    return { messages, data: directChat, type: 'direct' };
  }
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export const getSuggestions = async () => {
  const _suggestions = await db.query.suggestions.findMany({
    with: {
      choices: {
        with: { votes: { with: { user: true } } },
      },
    },
    where: ({ isAccepted }, { eq }) => {
      return eq(isAccepted, true);
    },
    // limit: 10,
  });

  return { suggestions: _suggestions };
};

export const getUserChats = async ({ userID }: { userID: number }) => {
  const groupChats = db.query.chatMembers.findMany({
    with: {
      chat: {
        with: {
          members: {
            with: { user: true },
            // orderBy({ joinedAt }, { asc }) {
            //   return [asc(joinedAt)];
            // },
          },
        },
      },
    },
    where(fields, operators) {
      return operators.eq(fields.userID, userID);
    },
  });

  const directChats = db.query.directChatMembers.findMany({
    with: {
      chat: {
        with: {
          members: {
            with: { user: true },
          },
        },
      },
      user: true,
    },
    where: (fields, { eq }) => eq(fields.userID, userID),
  });

  const [groups, directs] = await Promise.all([groupChats, directChats]);
  // const [groups, directs] = await Promise.all([groupChats, directChats]);
  const chats = [
    ...groups.map((member) => ({
      type: 'group' as const,
      lastMessageAt: member.chat.lastMessageAt,
      ...member,
    })),
    ...directs.map((member) => ({
      type: 'direct' as const,
      lastMessageAt: member.chat.lastMessageAt,
      ...member,
    })),
  ];

  chats.sort((a, b) => {
    if (!a.lastMessageAt) return 1;
    if (!b.lastMessageAt) return -1;
    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
  });
  return { chats };
};
