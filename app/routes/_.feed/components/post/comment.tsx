// 'use client';
import React, { startTransition, useEffect } from 'react';
import {
  Popover,
  Group,
  ActionIcon,
  useMantineTheme,
  TextInput,
  ThemeIcon,
  Menu,
  Stack,
  List,
  Avatar,
  Text,
  Divider,
  ListItem,
  CopyButton,
  Button,
  Modal,
  Alert,
  Box,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import styles from './post.module.css';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { fromNow, getFullName, getProfileInfoText } from '~/lib/utils';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { icons } from '~/lib/icons';
import { useDisclosure } from '@mantine/hooks';
import { INTENTS } from '~/lib/constants';
import { modals } from '@mantine/modals';
import { useTranslations } from 'use-intl';

export const AddComment = ({
  postID,
  openFirstFive,
}: {
  postID: number;
  openFirstFive: () => void;
}) => {
  const t = useTranslations();
  const theme = useMantineTheme();
  const fetcher = useFetcher();
  const [opened, { toggle, open, close }] = useDisclosure();
  // const lastResult = useActionData()
  // const [form, fields] = useForm({
  //   shouldValidate: 'onBlur',
  //   lastResult,
  //   onValidate: ({formData}) => {
  //     return parseWithZod(formData, {schema: commentSchema})
  //   }
  // })

  useEffect(() => {
    startTransition(() => {
      if (fetcher.data?.action === 'added') {
        close();
        openFirstFive();
      }
    });
  }, [fetcher.data]);
  return (
    <Popover opened={opened} onClose={close}>
      <Popover.Target>
        <ActionIcon className={styles.action} onClick={toggle}>
          <Icon
            icon={icons.comment}
            // style={{ width: rem(16), height: rem(16) }}
            color={theme.colors.yellow[7]}
          />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <fetcher.Form method='post'>
          <Group align='end' gap='xs'>
            <input type='hidden' name='postID' value={postID} />
            <TextInput
              placeholder={t('comment_placeholder')}
              variant='filled'
              name='content'
              required
            />
            <ActionIcon
              size='lg'
              variant='filled'
              name='intent'
              value={INTENTS.comment}
              type='submit'
              loading={
                fetcher.state === 'submitting' &&
                fetcher.formData?.get('intent') === INTENTS.comment
              }
            >
              <Icon
                icon={icons.send}
                // style={{ width: rem(32), height: rem(32) }}
                // className={i18n.language === 'ar' ? 'rotate-180' : ''}
              />
            </ActionIcon>
          </Group>
        </fetcher.Form>
      </Popover.Dropdown>
    </Popover>
  );
};

export const CommentActions = ({
  comment,
  isSameUser,
}: {
  comment: SerializeFrom<typeof loader>['posts']['data'][0]['comments'][0];
  isSameUser: boolean;
}) => {
  const t = useTranslations('common');
  const fetcher = useFetcher();

  useEffect(() => {
    startTransition(() => {
      fetcher.data && modals.closeAll();
    }, [fetcher.data]);
  });
  return (
    <>
      <Menu>
        <Menu.Target>
          <ActionIcon size='sm' className={styles.menuIcon} variant='subtle'>
            <Icon icon={icons.ellipsis} width={10} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <CopyButton value={comment.content}>
            {({ copied, copy }) => (
              <Menu.Item
                closeMenuOnClick={false}
                leftSection={<Icon icon={icons.copy} />}
                onClick={copy}
              >
                {copied ? t('copied') : t('copy')}
              </Menu.Item>
            )}
          </CopyButton>
          <Menu.Item
            leftSection={<Icon icon={icons.edit} />}
            hidden={!isSameUser}
            onClick={() => {
              modals.open({
                title: t('edit'),
                children: (
                  <>
                    <fetcher.Form method='POST' action='/feed'>
                      <Stack>
                        <input
                          type='hidden'
                          name='commentID'
                          value={comment.id}
                        />
                        <TextInput
                          data-autoFocus
                          name='content'
                          defaultValue={comment.content}
                        />
                        <Button
                          name='intent'
                          value={INTENTS.updateComment}
                          type='submit'
                          loading={
                            fetcher.state === 'submitting' &&
                            fetcher.formData?.get('intent') === 'comment_update'
                          }
                        >
                          {t('edit')}
                        </Button>
                      </Stack>
                    </fetcher.Form>
                  </>
                ),
              });
            }}
          >
            {t('edit')}
          </Menu.Item>
          <Menu.Item
            hidden={!isSameUser}
            leftSection={<Icon icon={icons.delete} />}
            onClick={() => {
              modals.open({
                title: t('are_you_sure'),
                children: (
                  <>
                    <Stack>
                      <Text>{t('confirm_delete_paragraph')}</Text>
                      <fetcher.Form method='POST' action='/feed'>
                        <input
                          type='hidden'
                          name='commentID'
                          value={comment.id}
                        />
                        <Button.Group>
                          <Button
                            leftSection={<Icon icon={icons.checkMark} />}
                            name='intent'
                            value={INTENTS.deleteComment}
                            type='submit'
                            fullWidth
                          >
                            {t('confirm')}
                          </Button>
                          <Button
                            variant='outline'
                            fullWidth
                            onClick={modals.closeAll}
                          >
                            {t('cancel')}
                          </Button>
                        </Button.Group>
                      </fetcher.Form>
                    </Stack>
                  </>
                ),
              });
            }}
            color='red'
          >
            {t('delete')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export const Comments = ({
  comments,
  userID,
}: {
  comments: SerializeFrom<typeof loader>['posts']['data'][0]['comments'];
  userID: number;
}) => {
  const [opened, { open, close }] = useDisclosure();
  const fetcher = useFetcher();
  const t = useTranslations('feed');
  return (
    <>
      {comments.length ? (
        <List icon={<ThemeIcon></ThemeIcon>}>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem
                className={`${styles.comment} ${
                  comment.userID === userID ? styles.highlightedComment : ''
                }`}
                icon={
                  <Popover>
                    <Popover.Target>
                      <Avatar
                        radius='md'
                        src={comment.user.profileImage}
                        name={getFullName(comment.user)}
                        color='initials'
                        onClick={open}
                      />
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Button
                        onClick={() => {
                          fetcher.load(
                            `/api/data?intent=${INTENTS.findChat}&fromID=${userID}&toID=${comment.userID}`
                          );
                        }}
                      >
                        إرسال رسالة
                      </Button>
                    </Popover.Dropdown>
                  </Popover>
                }
                w='100%'
              >
                <Text>{comment.content}</Text>

                <CommentActions
                  isSameUser={comment.userID === userID}
                  comment={comment}
                />
                <Group w='100%' justify='space-between'>
                  <Box fz='xs' c='dimmed'>
                    {getProfileInfoText(comment.user)}
                  </Box>
                  <Text className={styles.commentTime}>
                    {fromNow(comment.createdAt, 'ar')}
                  </Text>
                </Group>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Alert title={t('no_comments_yet')}>
          {t('no_comments_yet_description')}
        </Alert>
      )}
    </>
  );
};

export const AllComments = ({ opened, close, comments, userID }) => {
  const t = useTranslations('common');
  return (
    <Modal opened={opened} onClose={close} title={t('all_comments')}>
      <Stack>
        <Comments comments={comments} userID={userID} />
      </Stack>
    </Modal>
  );
};
