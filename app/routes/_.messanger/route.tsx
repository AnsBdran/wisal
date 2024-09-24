import { Avatar, Box, Divider, Group, Stack, Title } from '@mantine/core';
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/.server/db';
import { authenticator } from '~/services/auth.server';
import { Fragment } from 'react/jsx-runtime';
import { Chat } from './bits';
import { authenticateOrToast } from '~/.server/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  const chats = await db.query.chatMembers.findMany({
    with: {
      chat: {
        with: {
          members: {
            with: { user: true },
            orderBy({ joinedAt }, { asc }) {
              return [asc(joinedAt)];
            },
          },
        },
      },
    },
    where(fields, operators) {
      return operators.eq(fields.userID, user.id);
    },
  });
  return json({ chats });
};

const Messanger = () => {
  const { chats } = useLoaderData<typeof loader>();

  return (
    // <Stack py='xl' >
    <>
      {chats.map((chat) => (
        <Fragment key={chat.id}>
          <Chat chat={chat} />
          <Divider />
        </Fragment>
      ))}
    </>
    // </Stack>
  );
};

export default Messanger;
