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
import styles from './chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { fromNow, getFullName, getFullNameString } from '~/lib/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { useFetcher, useNavigate } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { act, useState } from 'react';
import { modals } from '@mantine/modals';

export const Message = ({
  m,
  user,
  isSameSenderAsNext,
  isSameSenderAsPrevious,
}: {
  m: SerializeFrom<typeof loader>['chat']['messages'][0];
  user: SerializeFrom<typeof loader>['user'];
  isSameSenderAsNext: boolean;
  isSameSenderAsPrevious: boolean;
}) => {
  const { t, i18n } = useTranslation();
  const editFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const isEditLoading = editFetcher.state !== 'idle';
  return (
    <Box
      className={
        m.senderID === user.id
          ? styles.outgoingContainer
          : styles.incomingContainer
      }
    >
      <Stack className={styles.messageInfo}>
        <Menu>
          <Menu.Target>
            <ActionIcon
              size='xs'
              className={styles.messageMenuIcon}
              variant='subtle'
            >
              <Icon
                icon={icons.ellipsis}
                style={{
                  width: rem('10px'),
                }}
              />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <CopyButton value={m.content}>
              {({ copy, copied }) => (
                <Menu.Item
                  leftSection={<Icon icon={icons.copy} />}
                  onClick={copy}
                  closeMenuOnClick={false}
                >
                  {copied ? t('copied') : t('copy')}
                </Menu.Item>
              )}
            </CopyButton>
            <Menu.Item
              hidden={user.id !== m.senderID}
              leftSection={<Icon icon={icons.edit} />}
              onClick={() => {
                // edit modal
                modals.open({
                  title: t('edit'),
                  id: 'edit-modal',
                  children: (
                    <>
                      <editFetcher.Form
                        method='post'
                        action={`/messanger/${m.chatID}`}
                      >
                        <Stack>
                          <TextInput
                            defaultValue={m.content}
                            name='content'
                            data-autoFocus
                          />
                          <input type='hidden' name='messageID' value={m.id} />
                          {/* <Button.Group > */}
                          <Button
                            fullWidth
                            name='intent'
                            value={INTENTS.editMessage}
                            loading={isEditLoading}
                            loaderProps={{
                              type: 'dots',
                            }}
                            type='submit'
                          >
                            {t('confirm')}
                          </Button>
                          <Button
                            fullWidth
                            variant='outline'
                            onClick={() => {
                              modals.closeAll();
                            }}
                            type='button'
                          >
                            {t('cancel')}
                          </Button>
                          {/* </Button.Group> */}
                        </Stack>
                      </editFetcher.Form>
                    </>
                  ),
                });
              }}
            >
              {t('edit')}
            </Menu.Item>
            <Menu.Item
              hidden={user.id !== m.senderID}
              leftSection={<Icon icon={icons.delete} />}
              onClick={() => {
                modals.openConfirmModal({
                  title: t('confirm'),
                  children: (
                    <>
                      <Text>{t('confirm_delete_paragraph')}</Text>
                    </>
                  ),
                  onConfirm: () => {
                    deleteFetcher.submit(
                      {
                        messageID: m.id,
                        intent: INTENTS.deleteMessage,
                      },
                      {
                        method: 'post',
                        action: `/messanger/${m.chatID}`,
                      }
                    );
                  },
                });
              }}
            >
              {t('delete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Text className={styles.sendTime}>{fromNow(m.createdAt, 'ar')}</Text>
      </Stack>
      <Group
        gap={0}
        className={m.senderID === user.id ? styles.outgoing : styles.incoming}
      >
        <Box key={m.id} className={styles.content}>
          <Stack gap='xs'>
            {!isSameSenderAsPrevious && (
              <Text fz='xs'>{getFullName(m.sender)}</Text>
            )}
            <Text>{m.content}</Text>
          </Stack>
          {!isSameSenderAsNext && (
            <Avatar
              src={m.sender.profileImage}
              name={getFullName(m.sender)}
              color='initials'
              radius='xs'
              className={styles.senderAvatar}
            />
          )}
        </Box>
      </Group>
    </Box>
  );
};

export const JoinedUsers = ({
  members,
  opened,
  onClose,
}: {
  opened: boolean;
  members: SerializeFrom<typeof loader>['chat']['data']['members'];
  // members: (typeof conversationMember.$inferSelect & {
  //   user: typeof user.$inferSelect;
  // })[];
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Drawer.Root
      style={{ overflow: 'hidden' }}
      opened={opened}
      onClose={onClose}
      position='bottom'
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{t('group_members')}</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body>
          <ScrollArea flex={1}>
            <Stack>
              {members.map((m) => (
                <Box key={m.id}>
                  <Group>
                    <Avatar
                      color='initials'
                      name={getFullNameString(m.user)}
                      radius='xs'
                    />
                    {getFullName(m.user)}
                  </Group>
                </Box>
              ))}
            </Stack>
          </ScrollArea>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export const ChatFooter = ({ chatID }: { chatID: number }) => {
  const fetcher = useFetcher();
  const { i18n } = useTranslation();
  return (
    <fetcher.Form
      method='POST'
      action={`/messanger/${chatID}`}
      style={{ height: '100%' }}
    >
      <Group h='100%'>
        <input type='hidden' name='chatID' value={chatID} />
        <Input
          className={styles.messageInput}
          flex={1}
          name='content'

          // variant='default'
        />
        <ActionIcon
          type='submit'
          variant='outline'
          size='lg'
          name='intent'
          value={INTENTS.sendMessage}
          loading={
            fetcher.state === 'submitting' &&
            fetcher.formData?.get('intent') === INTENTS.sendMessage
          }
        >
          <Icon
            icon={icons.send}
            className={i18n.language === 'ar' ? 'rotate-180' : ''}
          />
        </ActionIcon>
      </Group>
    </fetcher.Form>
  );
};

export const ChatHeader = ({
  chat,
}: {
  chat: SerializeFrom<typeof loader>['chat']['data'];
}) => {
  const [showUsers, setShowUsers] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <Group justify='space-between' h='100%'>
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
      {/* <Button
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
      </Button> */}
      <Group>
        <Text>{chat.name}</Text>

        <Avatar
          src={chat.image}
          name={chat.name}
          radius='sm'
          color='initials'
          onClick={() => setShowUsers(true)}
          className={styles.groupAvatar}
        />
        <JoinedUsers
          opened={showUsers}
          onClose={() => setShowUsers(false)}
          members={chat?.members}
        />
      </Group>
    </Group>
  );
};
