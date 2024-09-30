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
import { loader } from './route';
import { loader as apiLoader } from '~/routes/api.data';
import { Icon } from '@iconify/react';
import styles from './messanger.module.css';
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

export const Chat = ({
  chat,
}: {
  chat: SerializeFrom<typeof loader>['chats'][0];
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetcher = useFetcher();

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
                        chatID: chat.id,
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
              {chat.chat.members.slice(5, chat.chat.members.length).length}
            </Text>
          </Avatar>
        </Avatar.Group>
      </Group>
    </UnstyledButton>
  );
};

export const EmptyMessanger = ({ hidden }: { hidden: boolean }) => {
  const { t } = useTranslation();
  return (
    <>
      <Stack hidden={hidden} my={'xl'}>
        <Alert title={t('empty_messanger')}>
          {t('empty_messanger_description')}
        </Alert>
        <ChooseUserToMessage>
          <Button variant='gradient' w='100%' size='lg'>
            {t('start_first_chat')}
          </Button>
        </ChooseUserToMessage>
        {/* 
        <Modal opened={opened && fetcher.data?.users} onClose={close}>
          {fetcher.data?.users.map((u) => (
            <Box key={u.id}>{getProfileInfoText(u)}</Box>
          ))}
        </Modal> */}
      </Stack>
    </>
  );
};

export const ChooseUserToMessage = ({
  children,
}: // userID,
{
  children: ReactNode;
  // userID: number;
}) => {
  const [opened, { open, close }] = useDisclosure();
  const usersFetcher = useFetcher<typeof apiLoader>();
  const chatFetcher = useFetcher();
  const { t } = useTranslation();

  return (
    <>
      <UnstyledButton
        onClick={() => {
          usersFetcher.load(`/api/data?intent=${INTENTS.fetchUsers}`);
          open();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {children}
      </UnstyledButton>
      {/* <LoadingOverlay visible={usersFetcher.state === 'loading'} /> */}
      <Modal
        opened={opened}
        onClose={close}
        title={t('choose_User_to_chat_with')}
      >
        {usersFetcher.data?.users.map((u) => (
          <Box
            py={'xs'}
            key={u.id}
            style={{
              borderBottom: '.5px solid',
              borderColor: 'var(--mantine-color-dimmed)',
            }}
            onClick={() =>
              chatFetcher.submit(
                {
                  intent: INTENTS.findOrCreateChat,
                  // formID: userID,
                  targetID: u.id,
                },
                {
                  method: 'POST',
                }
              )
            }
          >
            {getProfileInfo(u)}
            {/* <Divider /> */}
          </Box>
        ))}
      </Modal>
    </>
  );
};

export const CreateChatGroupButton = () => {
  const fetcher = useFetcher();
  const [opened, { close, open }] = useDisclosure();
  const { t } = useTranslation('form');
  const [choosenMembers, setChoosenMembers] = useState<number[]>([]);
  const [form, { bio, members, name }] = useForm<ChatGroupSchemaType>({
    lastResult: fetcher.state === 'idle' ? fetcher.data : null,
  });
  console.log('users', choosenMembers);
  return (
    <>
      <ActionIcon variant='white' color='teal' onClick={open}>
        <Icon icon={icons.usersGroup} />
      </ActionIcon>

      <Modal opened={opened} onClose={close}>
        <fetcher.Form method='POST' onSubmit={form.onSubmit} id={form.id}>
          <Stack>
            <TextInput
              name={name.name}
              error={t(name.errors ?? '')}
              label={t('group_name')}
            />
            <Textarea
              name={bio.name}
              error={t(bio.errors ?? '')}
              label={t('group_description')}
            />
            <input
              type='hidden'
              name='members'
              value={JSON.stringify(choosenMembers)}
            />
            <Stack gap={0}>
              <InputLabel mb='2px'>{t('choose_group_members')}</InputLabel>
              <MultiSelect
                value={choosenMembers}
                setValue={setChoosenMembers}
              />
              <InputError>{t(members.errors ?? '')}</InputError>
            </Stack>
            <Button type='submit' name='intent' value={INTENTS.createChatGroup}>
              {t('create')}
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
};
