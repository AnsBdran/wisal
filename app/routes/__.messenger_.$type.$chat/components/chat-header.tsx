import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  CopyButton,
  Drawer,
  Group,
  Input,
  Menu,
  rem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import styles from '../chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
import { fromNow, getProfileInfoText, getFullName } from '~/lib/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { Link, useFetcher, useNavigate, useParams } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { act, useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { ChatInfo } from './chat-info';
import { ChatType, DirectChatType, GroupChatType } from '~/lib/types';

// type ChatType =

export const ChatHeader = ({ chat }: { chat: ChatType }) => {
  console.log('chat header', chat);
  return (
    <>
      {chat.type === 'group' ? (
        <ChatGroupHeader chat={chat} />
      ) : (
        <ChatDirectHeader chat={chat} />
      )}
    </>
  );
};

const ChatGroupHeader = ({ chat }: { chat: GroupChatType }) => {
  const [showUsers, setShowUsers] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { type } = useParams();

  return (
    <Group justify='space-between' h='100%'>
      <Group>
        <ActionIcon
          onClick={() => navigate(-1)}
          variant='outline'
          color='light-dark(black, white)'
          className={styles.backBtn}
        >
          <Icon
            icon={icons.arrow}
            className={i18n.language === 'en' ? 'rotate-180' : ''}
          />
        </ActionIcon>
        <ActionIcon
          variant='transparent'
          component={Link}
          to={`/messenger/${type}/${chat.chatID}/edit`}
          // hidden={chat.}
        >
          <Icon icon={icons.edit} />
        </ActionIcon>
      </Group>
      <Button
        onClick={() => navigate(-1)}
        variant='white'
        // color='light-dark(black, white)'
        className={styles.backBtn}
        leftSection={
          <Icon
            icon={icons.arrow}
            className={i18n.language === 'en' ? 'rotate-180' : ''}
          />
        }
      >
        {t('back')}
      </Button>
      <Group>
        <Text>{chat.chat.id}</Text>

        <Avatar
          src={chat.chat.image}
          name={chat.chat.name}
          radius='sm'
          color='initials'
          onClick={() => setShowUsers(true)}
          className={styles.groupAvatar}
        />
        <ChatInfo
          opened={showUsers}
          onClose={() => setShowUsers(false)}
          info={chat}
        />
      </Group>
    </Group>
  );
};

const ChatDirectHeader = ({ chat }: { chat: DirectChatType }) => {
  return <>direct</>;
};
