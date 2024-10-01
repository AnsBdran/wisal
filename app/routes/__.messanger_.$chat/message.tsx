import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  CopyButton,
  Group,
  Menu,
  rem,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import styles from './chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { fromNow, getProfileInfoText, getFullName } from '~/lib/utils';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { Link, useFetcher, useNavigate } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { modals } from '@mantine/modals';
import { Message as MessageType } from '~/lib/types';

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
            <EditMessage m={m} userID={user.id} />
            <DeleteMessage m={m} userID={user.id} />
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
              <Text fz='xs' c='red' bg={'yellow'}>
                {' '}
                nice
                {/* {getProfileInfoText(m.sender)} */}
              </Text>
            )}
            <Text>{m.content}</Text>
          </Stack>
          {!isSameSenderAsNext && (
            <Avatar
              src={m.sender.profileImage}
              name={getProfileInfoText(m.sender)}
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

const EditMessage = ({ userID, m }: { userID: number; m: MessageType }) => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';
  const { t } = useTranslation();
  return (
    <Menu.Item
      hidden={userID !== m.senderID}
      leftSection={<Icon icon={icons.edit} />}
      onClick={() => {
        // edit modal
        modals.open({
          title: t('edit'),
          id: 'edit-modal',
          children: (
            <>
              <fetcher.Form method='post' action={`/messanger/${m.chatID}`}>
                <Stack>
                  <TextInput
                    defaultValue={m.content}
                    name='content'
                    data-autoFocus
                  />
                  <input type='hidden' name='messageID' value={m.id} />
                  <Group justify='space-between'>
                    <Button
                      name='intent'
                      value={INTENTS.editMessage}
                      loading={isLoading}
                      loaderProps={{
                        type: 'dots',
                      }}
                      type='submit'
                    >
                      {t('confirm')}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => {
                        modals.closeAll();
                      }}
                      type='button'
                    >
                      {t('cancel')}
                    </Button>
                  </Group>
                </Stack>
              </fetcher.Form>
            </>
          ),
        });
      }}
    >
      {t('edit')}
    </Menu.Item>
  );
};

const DeleteMessage = ({ userID, m }: { userID: number; m: MessageType }) => {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  return (
    <Menu.Item
      hidden={userID !== m.senderID}
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
            fetcher.submit(
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
  );
};
