import {
  ActionIcon,
  Group,
  Menu,
  rem,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useFetcher, useNavigate } from '@remix-run/react';
import { DirectChatMemberWithUser, DirectChatType } from '~/lib/types';
import { getFullName, getProfileInfo } from '~/lib/utils';
import styles from '../messenger.module.css';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { modals } from '@mantine/modals';

export const DirectChat = ({ directChat }: { directChat: DirectChatType }) => {
  console.log('direct chat', directChat);
  const otherUser = directChat.chat.members.find(
    (member) => member.userID !== directChat.userID
  ) as DirectChatMemberWithUser;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  return (
    <UnstyledButton
      onClick={() => navigate(`./${directChat.chatID}`)}
      className={styles.chatContainer}
    >
      <Group className={styles.upperRow}>
        {getProfileInfo(otherUser.user)}
      </Group>
      <Group justify='space-between'>
        <Text fz='sm' c='dimmed'>
          {otherUser?.user.bio}
        </Text>
      </Group>
    </UnstyledButton>
  );
};
