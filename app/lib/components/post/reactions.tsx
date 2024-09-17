// 'use client';
import {
  Popover,
  Group,
  ActionIcon,
  rem,
  useMantineTheme,
  Stack,
  Avatar,
  Text,
  Center,
  Box,
  SegmentedControl,
  Modal,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import styles from './post.module.css';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { postReaction, user } from '~/.server/db/schema';
import { getFullName, getReactionIconData } from '~/lib/utils';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { icons } from '~/lib/icons';
import { INTENTS, REACTIONS } from '~/lib/constants';
import { useState } from 'react';

export const Reactions = ({
  post,
}: {
  post: SerializeFrom<typeof loader>['posts']['data'][0];
}) => {
  const theme = useMantineTheme();
  const fetcher = useFetcher();
  const reactions: string[] = [
    'love',
    'like',
    'haha',
    'sad',
    'wow',
    'angry',
    'dislike',
  ];
  return (
    <Popover>
      <Popover.Target>
        <ActionIcon
          style={{
            color: post.reactions.length > 0 ? '' : 'red',
          }}
          variant={post.reactions.length ? 'light' : 'subtle'}
        >
          <Icon
            icon={
              post.reactions.length
                ? getReactionIconData(post.reactions[0].type).icon
                : icons.heartOutline
            }
            // color={theme.colors.red[6]}
            style={{ width: rem(16), height: rem(16) }}
          />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <ActionIcon.Group>
          {reactions.map((r) => (
            <ActionIcon
              key={r}
              variant={
                post.reactions.length
                  ? post.reactions[0].type === r
                    ? 'filled'
                    : 'default'
                  : 'default'
              }
              onClick={() => {
                fetcher.submit(
                  { intent: INTENTS.react, type: r, postID: post.id },
                  {
                    method: 'POST',
                  }
                );
              }}
              loading={
                fetcher.state === 'submitting' &&
                fetcher.formData?.get('type') === r
              }
            >
              <Icon
                icon={getReactionIconData(r)?.icon}
                className={`${r === 'dislike' ? 'rotate-180' : ''} ${
                  r === 'like' ? 'flip' : ''
                }`}
              />
            </ActionIcon>
          ))}
        </ActionIcon.Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export const ReactionsStats = ({
  opened,
  close,
  reactions,
}: {
  opened: boolean;
  close: () => void;
  reactions: (typeof postReaction.$inferSelect & {
    user: typeof user.$inferSelect;
  })[];
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState('like');
  return (
    <>
      {reactions.length ? (
        <Modal
          opened={opened}
          onClose={close}
          title={t('all_reactions')}
          // classNames={{ root: 'overflow-hidden' }}
        >
          <SegmentedControl
            fullWidth
            onChange={(v) => setType(v)}
            data={REACTIONS.map((r) => ({
              value: r,
              label: (
                <Center>
                  <Icon
                    style={{ flex: 1 }}
                    icon={getReactionIconData(r).icon}
                    color={getReactionIconData(r).color}
                  />
                </Center>
              ),
            }))}
            flex={1}
          />
          <Stack py='xl' px='sm'>
            {reactions
              .filter((r) => r.type === type)
              .map((r) => (
                <Box key={r.id}>
                  <Group>
                    <Avatar
                      src={r.user.profileImage}
                      name={getFullName(r.user)}
                      color='initials'
                    />
                    {getFullName(r.user)}
                  </Group>
                </Box>
              ))}
          </Stack>
        </Modal>
      ) : undefined}{' '}
    </>
  );
};
