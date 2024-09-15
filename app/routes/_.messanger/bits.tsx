import {
  Box,
  Group,
  Avatar,
  Title,
  Text,
  Center,
  ActionIcon,
  Menu,
  UnstyledButton,
  Tooltip,
  rem,
} from '@mantine/core';
import { Link, useNavigate } from '@remix-run/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { Icon } from '@iconify/react';
import styles from './messanger.module.css';
import { getFullName } from '~/lib/utils';
import { icons } from '~/lib/icons';
import { useTranslation } from 'react-i18next';

export const Chat = ({
  chat,
}: {
  chat: SerializeFrom<typeof loader>['chats'][0];
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <UnstyledButton
      onClick={() => navigate(`./${chat.chatID}`)}
      className={styles.chatContainer}
    >
      <Group className={styles.upperRow}>
        <Avatar
          src={chat.chat.image}
          color='initials'
          variant='outline'
          radius='sm'
          name={chat.chat.name}
        />
        <Title order={4} className={styles.title}>
          {chat.chat.name}
        </Title>
        <Menu>
          <Menu.Target>
            <ActionIcon
              variant='transparent'
              size='xs'
              className={styles.menuBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon icon={icons.ellipsis} width={rem('10px')} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item>{t('')}</Menu.Item> */}
            <Menu.Item color='red' leftSection={<Icon icon={icons.exit} />}>
              {t('chat_exit')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group justify='space-between'>
        <Tooltip label={chat.chat.bio}>
          <Text
            fz='sm'
            color='dimmed'
            style={{
              width: '60%',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {chat.chat.bio}
          </Text>
        </Tooltip>
        <Avatar.Group onClick={(e) => e.stopPropagation()}>
          {chat.chat.members.slice(0, 5).map((member) => (
            <Tooltip withArrow key={member.id} label={getFullName(member.user)}>
              <Avatar
                size='sm'
                src={member.user.profileImage}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          ))}
          <Avatar size='sm'>
            <Icon icon={icons.add} fontSize='.7em' />
            <Text span fz='xs'>
              {chat.chat.members.slice(5, chat.chat.members.length).length}
            </Text>
          </Avatar>
        </Avatar.Group>
      </Group>
    </UnstyledButton>
  );
};
