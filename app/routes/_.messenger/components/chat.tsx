import {
  Group,
  Avatar,
  Title,
  Text,
  ActionIcon,
  Menu,
  UnstyledButton,
  Tooltip,
  Stack,
} from '@mantine/core';
import { useFetcher, useNavigate } from '@remix-run/react';
import styles from '../messenger.module.css';
import { getProfileInfo, getProfileInfoText } from '~/lib/utils';
import { Icons } from '~/lib/icons';
import { INTENTS } from '~/lib/constants';
import { modals } from '@mantine/modals';
import {
  DirectChatMemberWithUser,
  DirectChatType,
  GroupChatType,
} from '~/lib/types';
import { useTranslations } from 'use-intl';
// import { useColorScheme } from '@mantine/hooks';

export const GroupChat = ({
  groupChat: chatGroupMember,
}: {
  groupChat: GroupChatType;
  // chatGroupMember: SerializeFrom<typeof loader>['chats'][0];
}) => {
  const navigate = useNavigate();
  const t = useTranslations('common');
  const fetcher = useFetcher();

  return (
    <UnstyledButton
      onClick={() => navigate(`./${chatGroupMember.chatID}`)}
      className={styles.chatContainer}
      component={Stack}
    >
      <Group className={styles.upperRow}>
        <Avatar
          src={chatGroupMember.chat.image}
          color='initials'
          variant='outline'
          radius='sm'
          name={chatGroupMember.chat.name}
        />
        <Title order={4} className={styles.title}>
          {chatGroupMember.chat.name}
        </Title>
        <Menu>
          <Menu.Target>
            <ActionIcon
              variant='transparent'
              size='xs'
              className={styles.menuBtn}
              onClick={(e) => e.stopPropagation()}
              component='i'
            >
              <Icons.ellipsis />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item>{t('')}</Menu.Item> */}
            <Menu.Item
              color='red'
              leftSection={<Icons.logout />}
              onClick={(ev) => {
                ev.stopPropagation();
                modals.openConfirmModal({
                  children: (
                    <>
                      <Text>{t('confirm_chat_exit')}</Text>
                    </>
                  ),
                  onConfirm: () => {
                    fetcher.submit(
                      {
                        intent: INTENTS.exitChatGroup,
                        chatID: chatGroupMember.id,
                      },
                      { method: 'POST' }
                    );
                  },
                });
              }}
            >
              {t('chat_exit')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group justify='space-between'>
        <Tooltip label={chatGroupMember.chat.bio}>
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
            {chatGroupMember.chat.bio}
          </Text>
        </Tooltip>
        <Avatar.Group onClick={(e) => e.stopPropagation()}>
          {chatGroupMember.chat.members.slice(0, 5).map((member) => (
            <Tooltip
              withArrow
              key={member.id}
              label={getProfileInfoText(member.user)}
            >
              <Avatar
                size='sm'
                src={member.user.profileImage}
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
          ))}
          <Avatar size='sm' hidden={chatGroupMember.chat.members.length < 6}>
            <Icons.add fontSize='.7em' />
            <Text span fz='xs'>
              {
                chatGroupMember.chat.members.slice(
                  5,
                  chatGroupMember.chat.members.length
                ).length
              }
            </Text>
          </Avatar>
        </Avatar.Group>
      </Group>
    </UnstyledButton>
  );
};

export const DirectChat = ({ directChat }: { directChat: DirectChatType }) => {
  // const isDark = useColorScheme() === 'dark' ? true : false;
  const otherUser = directChat.chat.members.find(
    (member) => member.userID !== directChat.userID
  ) as DirectChatMemberWithUser;
  const navigate = useNavigate();
  const t = useTranslations('common');
  return (
    <UnstyledButton
      onClick={() => navigate(`./${directChat.chatID}`)}
      className={`${styles.chatContainer} ${styles.directChatContainer}`}
      component={Stack}
    >
      <Group className={styles.upperRow} justify='space-between'>
        {getProfileInfo(otherUser.user)}
      </Group>
      <Group justify='space-between'>
        <Text fz='sm' c='dimmed'>
          {otherUser?.user.bio}
        </Text>
        {/* <Badge variant={isDark ? 'white' : 'light'} size='xs'>
          {t('private_chat')}
        </Badge> */}
      </Group>
    </UnstyledButton>
  );
};
