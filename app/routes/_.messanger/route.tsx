import { Avatar, Box, Divider, Group, Stack, Title } from '@mantine/core';
import {
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/.server/db';
import { authenticator } from '~/services/auth.server';
import classes from './messanger.module.css';
import { Fragment } from 'react/jsx-runtime';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return redirect('/login');

  const chats = await db.query.conversationMember.findMany({
    with: {
      conversation: true,
    },
    where(fields, operators) {
      return operators.eq(fields.userID, user.id);
    },
  });
  return json({ chats });
};

const Messanger = () => {
  const { chats } = useLoaderData<typeof loader>();

  // console.log('chats recieved', chats);

  return (
    <Stack py='xl'>
      {chats.map((chat) => (
        <Fragment key={chat.id}>
          <Box className={classes.chatContainer}>
            <Group>
              <Avatar
                src={chat.conversation.image}
                color='initials'
                variant='outline'
                radius='sm'
              />
              <Title order={3} className={classes.title}>
                {chat.conversation.name}
              </Title>
            </Group>
          </Box>
          <Divider />
        </Fragment>
      ))}
    </Stack>
  );
};

export default Messanger;
