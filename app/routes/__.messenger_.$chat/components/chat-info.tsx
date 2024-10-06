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
  Title,
} from '@mantine/core';
import styles from '../chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
import { fromNow, getProfileInfoText, getFullName } from '~/lib/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { Link, useFetcher, useNavigate } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { act, useEffect, useState } from 'react';
import { modals } from '@mantine/modals';
import { ChatWithMembers } from '~/lib/types';

export const ChatInfo = ({
  info,
  opened,
  onClose,
}: {
  opened: boolean;
  info: ChatWithMembers;
  onClose: () => void;
}) => {
  const { t } = useTranslation('messanger');
  return (
    <Drawer.Root
      style={{ overflow: 'hidden' }}
      opened={opened}
      onClose={onClose}
      position='bottom'
      size='xl'
      removeScrollProps={{
        enabled: false,
      }}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{t('chat_info')}</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <Stack>
            <Group>
              <Text c='dimmed'>اسم المجموعة</Text>
              <Title order={3}>{info.name}</Title>
            </Group>
            <Group>
              <Text c='dimmed'>وصف المجموعة</Text>
              <Title order={3}>{info.bio}</Title>
            </Group>
            <Title order={3}>أعضاء المجموعة</Title>
            <ScrollArea flex={1}>
              <Stack>
                {info.members.map((m) => (
                  // {info.chat.members.map((m) => (
                  <Box key={m.userID}>
                    <Group>
                      <Avatar
                        color='initials'
                        name={getFullName(m.user)}
                        radius='xs'
                      />
                      {getProfileInfoText(m.user)}
                    </Group>
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};
