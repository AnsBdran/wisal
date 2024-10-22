import { ActionIcon, Avatar, Group, Text, Title } from '@mantine/core';
import styles from '../chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
import { Icons } from '~/lib/icons';
import { Link } from '@remix-run/react';
import { useState } from 'react';
import { ChatInfo } from './chat-info';
import { ChatWithMembers, DirectChatWithMembers } from '~/lib/types';
import { getProfileInfo } from '~/lib/utils';
import { BackBtn } from '~/lib/components/common/back-btn';

export const ChatHeader = ({
  chat,
  userID,
}: // type,
{
  chat: SerializeFrom<typeof loader>['chat'];
  userID: number;
  // chat: SerializeFrom<typeof loader>['chat'];
  // type: 'direct' | 'group';
}) => {
  // console.log('chat header', type);
  return (
    <Group justify='space-between' h='100%'>
      {chat.type === 'group' ? (
        <>
          <ChatGroupHeader chat={chat.data} userID={userID} color='teal' />
        </>
      ) : (
        <>
          <ChatDirectHeader chat={chat.data} userID={userID} color='blue' />
        </>
      )}
    </Group>
  );
};

const ChatGroupHeader = ({
  chat: data,
  userID,
}: // color,
{
  chat: ChatWithMembers;
  userID: number;
  // color: string;
  // chat: SerializeFrom<typeof loader>['chat']['data'];
}) => {
  const [showUsers, setShowUsers] = useState(false);
  // const t = useTranslations('common');
  // const navigate = useNavigate();
  // const { type } = useParams();
  console.log('in chat group header', data);
  return (
    <>
      <Group>
        <BackBtn color='teal' />
        <ActionIcon
          variant='transparent'
          component={Link}
          to={`/messenger/${data.id}/edit`}
          hidden={data.creatorID !== userID}
          color='teal'
        >
          <Icons.edit />
        </ActionIcon>
      </Group>
      <Group>
        <Text>{data.name}</Text>

        <Avatar
          src={data.image}
          name={data.name}
          radius='sm'
          color='teal'
          onClick={() => setShowUsers(true)}
          className={styles.groupAvatar}
        />
        <ChatInfo
          opened={showUsers}
          onClose={() => setShowUsers(false)}
          info={data}
        />
      </Group>
    </>
  );
};

const ChatDirectHeader = ({
  chat,
  userID,
}: // color,
{
  chat: DirectChatWithMembers;
  userID: number;
  // color: string;
}) => {
  const otherUser = chat.members.find((u) => u.userID !== userID);
  return (
    <>
      <BackBtn color='blue' />
      {getProfileInfo(otherUser!.user, {
        reverse: true,
        color: 'blue',
      })}
    </>
  );
};
