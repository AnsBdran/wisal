import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/.server/db';

export const loader: LoaderFunction = async () => {
  const chats = await db.query.conversationMember.findMany({
    with: {
      conversation: true,
    },
  });
  return { chats };
  //   return json({ chats });
};

const Messanger = () => {
  const { chats } = useLoaderData<typeof loader>();
  console.log(chats);
  return <div>{/* {chat} */}hi</div>;
};

export default Messanger;
