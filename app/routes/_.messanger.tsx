import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/.server/db';

export const loader: LoaderFunction = async () => {
  const chats = await db.query.conversation.findMany({
    with: {
      members: true,
      messages: true,
    },
    where(fields, operators) {
      return operators.eq(fields.id, 8);
    },
  });
  return json({ chats });
};

const Messanger = () => {
  const { chats } = useLoaderData<typeof loader>();
  console.log('chats recieved', chats);
  return <div>{/* {chat} */}hi</div>;
};

export default Messanger;
