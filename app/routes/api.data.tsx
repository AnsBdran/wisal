import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { findOrCreateChat } from '~/.server/utils';
import { INTENTS } from '~/lib/constants';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // authenticate the request
  await new Promise((res) => setTimeout(res, 500));
  const { searchParams } = new URL(request.url);
  // const formData = await request.formData();
  // const id = formData.get('id') as string;
  // const intent = formData.get('intent') as string;
  const intent = searchParams.get('intent');
  const id = searchParams.get('postID');
  switch (intent) {
    case INTENTS.fetchComments: {
      const comments = await db.query.comments.findMany({
        with: {
          user: true,
          reactions: true,
        },
        where(fields, operators) {
          return operators.eq(fields.postID, id);
        },
        orderBy(fields, operators) {
          return operators.desc(fields.createdAt);
        },
      });
      return json({ comments });
    }
    case INTENTS.fetchReactions: {
      const reactions = await db.query.postReactions.findMany({
        with: {
          user: true,
        },
        where(fields, operators) {
          return operators.eq(fields.postID, id);
        },
      });
      return json({ reactions });
    }
    case INTENTS.fetchUsers: {
      // await new Promise((res) => setTimeout(res, 1500));
      const _users = await db.select().from(users);
      return json({ users: _users });
    }
    case INTENTS.findChat: {
      const fromID = searchParams.get('fromID');
      const toID = searchParams.get('toID');
      const chatType = searchParams.get('chatType');
      const chat = await findOrCreateChat(Number(fromID), Number(toID), );
      return redirect(`/messenger/${chat.id}`);
    }
    default:
      return null;
  }
};
