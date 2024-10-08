import { ActionIcon, Avatar, Group, Text, Title } from '@mantine/core';
import styles from '../chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { Link, useFetcher, useNavigate, useParams } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { act, useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { ChatInfo } from './chat-info';
import {
  ChatType,
  ChatWithMembers,
  DirectChatType,
  DirectChatWithMembers,
  GroupChatType,
} from '~/lib/types';
import { useUserSessionContext } from '~/lib/contexts/user-session';
import { getProfileInfo } from '~/lib/utils';
import { BackBtn } from '~/lib/components/common/back-btn';

// type ChatType =

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
    <>
      {chat.type === 'group' ? (
        <>
          <ChatGroupHeader chat={chat.data} userID={userID} />
        </>
      ) : (
        <>
          <ChatDirectHeader chat={chat.data} userID={userID} />
        </>
      )}
    </>
  );
};

const ChatGroupHeader = ({
  chat: data,
  userID,
}: {
  chat: ChatWithMembers;
  userID: number;
  // chat: SerializeFrom<typeof loader>['chat']['data'];
}) => {
  const [showUsers, setShowUsers] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  // const { type } = useParams();
  console.log('in chat group header', data);
  return (
    <Group justify='space-between' h='100%'>
      <Group>
        <BackBtn />
        <ActionIcon
          variant='transparent'
          component={Link}
          to={`/messenger/${data.id}/edit`}
          hidden={data.creatorID !== userID}
        >
          <Icon icon={icons.edit} />
        </ActionIcon>
      </Group>
      <Group>
        <Text>{data.name}</Text>

        <Avatar
          src={data.image}
          name={data.name}
          radius='sm'
          color='initials'
          onClick={() => setShowUsers(true)}
          className={styles.groupAvatar}
        />
        <ChatInfo
          opened={showUsers}
          onClose={() => setShowUsers(false)}
          info={data}
        />
      </Group>
    </Group>
  );
};

const ChatDirectHeader = ({
  chat,
  userID,
}: {
  chat: DirectChatWithMembers;
  userID: number;
}) => {
  const otherUser = chat.members.find((u) => u.userID !== userID);
  return (
    <Group h='100%' justify='space-between'>
      <BackBtn />
      {getProfileInfo(otherUser!.user, {
        reverse: true,
      })}
    </Group>
  );
};
