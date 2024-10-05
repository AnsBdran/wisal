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
  Stack,
  Alert,
  Button,
  Modal,
  LoadingOverlay,
  Divider,
  TextInput,
  Textarea,
  InputLabel,
  InputError,
} from '@mantine/core';
import { Link, useFetcher, useNavigate } from '@remix-run/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
import { loader as apiLoader } from '~/routes/api.data';
import { Icon } from '@iconify/react';
import styles from '../messenger.module.css';
import { getProfileInfo, getProfileInfoText } from '~/lib/utils';
import { icons } from '~/lib/icons';
import { useTranslation } from 'react-i18next';
import { INTENTS } from '~/lib/constants';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import { findOrCreateChat } from '~/.server/utils';
import MultiSelect from '~/lib/components/common/users-multi-select';
import { useForm } from '@conform-to/react';
import { ChatGroupSchemaType } from '~/lib/schemas';
import { modals } from '@mantine/modals';
import { GroupChatType } from '~/lib/types';
export const GroupChat = ({
  groupChat: chatGroupMember,
}: {
  groupChat: GroupChatType;
  // chatGroupMember: SerializeFrom<typeof loader>['chats'][0];
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <UnstyledButton
      onClick={() => navigate(`./group/${chatGroupMember.chatID}`)}
      className={styles.chatContainer}
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
            >
              <Icon icon={icons.ellipsis} width={rem('10px')} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item>{t('')}</Menu.Item> */}
            <Menu.Item
              color='red'
              leftSection={<Icon icon={icons.exit} />}
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
          <Avatar size='sm'>
            <Icon icon={icons.add} fontSize='.7em' />
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
