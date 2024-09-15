import { count } from 'drizzle-orm';
import { db } from './db';
import { posts } from './db/schema';
import { getPagination } from './utils';

export const getChatMessages = async ({ id }) => {
  const messages = await db.query.messages.findMany({
    where({ chatID }, { eq }) {
      return eq(chatID, id);
    },
    with: {
      sender: true,
    },
    // limit: 100,
    orderBy(fields, operators) {
      return operators.asc(fields.createdAt);
    },
  });

  return messages;
};

export const getPosts = async ({
  page,
  userID,
  tag,
  searchQueries,
}: {
  page: number;
  tag: string;
  userID: number;
  searchQueries: Record<string, string>;
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
        // with: {
        //   user: true,
        // },
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

export const getChatData = async ({ chatID }: { chatID: number }) => {
  const messages = await getChatMessages({ id: chatID });

  const chat = await db.query.chats.findFirst({
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
  if (!chat) throw new Response(null, { status: 404, statusText: 'not found' });
  return { messages, data: chat };
};
