import { SerializeFrom } from '@remix-run/node';
import { action, loader } from './route';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  InputLabel,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { Form, useActionData, useFetcher } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@conform-to/react';
import { ChatGroupSchemaType } from '~/lib/schemas';
import { getProfileInfo } from '~/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { modals } from '@mantine/modals';
import { INTENTS } from '~/lib/constants';
import UserMultiSelect from '~/lib/components/common/users-multi-select';
import { useState } from 'react';

const ChatEditForm = ({
  chat,
}: {
  chat: SerializeFrom<typeof loader>['chat'];
}) => {
  const lastResult = useActionData<typeof action>();
  const { t } = useTranslation('form');
  const [newMembers, setNewMembers] = useState<number[]>([]);
  const [form, { name, bio, members }] = useForm<ChatGroupSchemaType>({
    id: 'chat-edit-form',
    defaultValue: {
      bio: chat?.bio,
      members: chat?.members.map((mem) => mem.userID),
      name: chat?.name,
    },
    lastResult,
  });
  const fetcher = useFetcher();
  return (
    <>
      <Paper withBorder p='xl'>
        <Stack>
          <Form method='POST'>
            <input
              type='hidden'
              name='members'
              value={JSON.stringify(newMembers)}
            />
            <input type='hidden' name='chatID' value={chat?.id} />
            <Stack>
              <TextInput
                label={t('chat_name')}
                name={name.name}
                defaultValue={name.initialValue}
                error={t(name.errors ?? '')}
              />
              <Textarea
                label={t('chat_description')}
                name={bio.name}
                defaultValue={bio.initialValue}
                error={t(bio.errors ?? '')}
              />
              <Stack gap={'3px'}>
                <InputLabel>{t('add_new_members')}</InputLabel>
                <UserMultiSelect
                  excludedUsers={chat?.members.map((m) => m.userID)}
                  value={newMembers}
                  setValue={setNewMembers}
                />
              </Stack>
              <Button type='submit' name='intent' value={INTENTS.editChatGroup}>
                {t('edit')}
              </Button>
            </Stack>
          </Form>
          <Title order={3}>
            {t('chat_members')} <Badge>{chat?.members.length}</Badge>
          </Title>
          <Stack>
            {chat?.members.map((mem) => (
              <Group key={mem.id} justify='space-between'>
                {getProfileInfo(mem.user)}
                <ActionIcon
                  color='red'
                  onClick={() => {
                    modals.openConfirmModal({
                      children: (
                        <>
                          <Text>{t('confirm_chat_member_remove')}</Text>
                        </>
                      ),
                      onConfirm: () => {
                        fetcher.submit(
                          {
                            intent: INTENTS.removeChatMember,
                            memberID: mem.id,
                          },
                          {
                            method: 'POST',
                          }
                        );
                      },
                    });
                  }}
                >
                  <Icon icon={icons.delete} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default ChatEditForm;
