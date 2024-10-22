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
  Image,
} from '@mantine/core';
import styles from '../chat.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
import { fromNow, getProfileInfoText, getFullName } from '~/lib/utils';
import { Icons } from '~/lib/icons';
import { useFetcher, useParams } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { modals } from '@mantine/modals';
import { useEffect } from 'react';
import { useTranslations } from 'use-intl';

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
  const t = useTranslations('common');
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
              style={{
                visibility:
                  m.senderID !== user.id && m.contentType !== 'text'
                    ? 'hidden'
                    : 'visible',
              }}
            >
              <Icons.ellipsis
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
                  leftSection={<Icons.copy />}
                  onClick={copy}
                  closeMenuOnClick={false}
                  hidden={m.contentType !== 'text'}
                >
                  {copied ? t('copied') : t('copy')}
                </Menu.Item>
              )}
            </CopyButton>
            <EditMessage
              m={m}
              userID={user.id}
              hidden={m.contentType !== 'text'}
            />
            <DeleteMessage m={m} userID={user.id} />
          </Menu.Dropdown>
        </Menu>
        <Text className={styles.sendTime}>{fromNow(m.createdAt, 'ar')}</Text>
      </Stack>
      <Group
        gap={0}
        className={`${
          m.senderID === user.id ? styles.outgoing : styles.incoming
        } ${
          m.contentType === 'image' ? styles.imageContent : styles.textContent
        }`}
      >
        {m.contentType === 'image' ? (
          <>
            <Stack gap={0}>
              {!isSameSenderAsPrevious && getProfileInfoText(m.sender)}
              <Box className={styles.imageContainer}>
                <Image src={m.content} className={styles.image} />
              </Box>
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
          </>
        ) : (
          <Box key={m.id} className={styles.textContent}>
            <Stack gap={0}>
              {!isSameSenderAsPrevious && getProfileInfoText(m.sender)}
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
        )}
      </Group>
    </Box>
  );
};

const EditMessage = ({
  userID,
  m,
  hidden,
}: {
  userID: number;
  m: SerializeFrom<typeof loader>['chat']['messages'][0];
  hidden: boolean;
}) => {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';
  const t = useTranslations('common');
  console.log('edit message rendered');
  useEffect(() => {
    console.log('use Effect ran', isLoading, fetcher.data);
    if (fetcher.data?.success) {
      modals.closeAll();
    }
  }, [fetcher.data]);
  return (
    <Menu.Item
      hidden={userID !== m.senderID || hidden}
      leftSection={<Icons.edit />}
      onClick={() => {
        // edit modal
        modals.open({
          title: t('edit'),
          id: 'edit-modal',
          children: (
            <>
              <fetcher.Form method='post' action={`/messenger/${m.chatID}`}>
                <Stack>
                  <TextInput
                    defaultValue={m.content}
                    name='content'
                    data-autoFocus
                  />
                  <input type='hidden' name='messageID' value={m.id} />
                  <Group>
                    <Button
                      name='intent'
                      value={INTENTS.editMessage}
                      loading={fetcher.state === 'submitting'}
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

const DeleteMessage = ({
  userID,
  m,
}: {
  userID: number;
  m: SerializeFrom<typeof loader>['chat']['messages'][0];
}) => {
  const t = useTranslations('common');
  const fetcher = useFetcher();
  const params = useParams();
  return (
    <Menu.Item
      hidden={userID !== m.senderID}
      leftSection={<Icons.delete />}
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
                action: `/messenger/${m.chatID}`,
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
