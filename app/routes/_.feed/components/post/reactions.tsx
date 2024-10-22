import {
  Popover,
  Group,
  ActionIcon,
  Stack,
  Text,
  Center,
  Box,
  SegmentedControl,
  Modal,
  Indicator,
  ScrollAreaAutosize,
  Alert,
  Badge,
  Image,
} from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { getProfileInfo, fromNow } from '~/lib/utils';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { emojis } from '~/lib/icons';
import { INTENTS, REACTIONS } from '~/lib/constants';
import { useState } from 'react';
import { useLocale, useTranslations } from 'use-intl';
import { EmojisEnum } from '~/lib/types';
import styles from '../../feed.module.css';

export const Reactions = ({
  post,
}: {
  post: SerializeFrom<typeof loader>['posts']['data'][0];
}) => {
  const fetcher = useFetcher();
  const reactions: EmojisEnum[] = [
    'love',
    'like',
    'haha',
    'sad',
    'wow',
    'angry',
    'dislike',
  ];

  console.log('in the lab', post.reactions[0].type);
  return (
    <Popover>
      <Popover.Target>
        <ActionIcon
          variant={post.reactions.length ? 'light' : 'transparent'}
          className={
            post.reactions[0].type !== 'love' &&
            post.reactions[0].type !== 'haha' &&
            post.reactions[0].type !== 'sad'
              ? 'p-1'
              : ''
          }
        >
          {post.reactions.length ? (
            <Image src={emojis[post.reactions[0].type]} />
          ) : (
            'h'
          )}
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <ActionIcon.Group>
          {reactions.map((r) => (
            <ActionIcon
              key={r}
              size='xl'
              className={
                r !== 'love' && r !== 'haha' && r !== 'sad' ? 'p-1' : ''
              }
              variant={
                post.reactions.length
                  ? post.reactions[0].type == r
                    ? 'light'
                    : 'transparent'
                  : 'transparent'
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
              <Image src={emojis[r]} />
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
  reactions: SerializeFrom<typeof loader>['posts'][0]['reactions'];
}) => {
  const t = useTranslations('feed');
  const [type, setType] = useState('all');
  const locale = useLocale();

  const ReactionStat = ({
    r,
  }: {
    r: SerializeFrom<typeof loader>['posts'][0]['reactions'][0];
  }) => {
    return (
      <Box>
        <Group justify='space-between'>
          {/* <Indicator
            label={<Icon icon={getReactionIconData(r.type).icon} />}
            color='transparent'
            size={24}
          > */}
          <Group>
            {getProfileInfo(r.user)}
            <Box className={styles.userEmoji}>
              <Image src={emojis[r.type]} />
            </Box>
          </Group>

          {/* </Indicator> */}
          <Badge variant='transparent'>{fromNow(r.createdAt, locale)}</Badge>
        </Group>
        {/* <Group>
          <Indicator
            label={<Icon icon={getReactionIconData(r.type).icon} />}
            color='transparent'
            size={24}
          >
            <Avatar
              src={r.user.profileImage}
              name={getFullName(r.user)}
              color='initials'
              radius='md'
            />
          </Indicator>

          {getProfileInfoText(r.user)}
        </Group> */}
      </Box>
    );
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={t('all_post_reactions')}
        styles={{
          content: {
            overflow: 'hidden',
          },
        }}
        // h='80vh'
        // classNames={{ root: 'overflow-hidden' }}
      >
        {reactions.length ? (
          <>
            <SegmentedControl
              fullWidth
              onChange={(v) => setType(v)}
              styles={{
                label: {
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
              data={[
                {
                  label: (
                    <Center>
                      <Text>{t('all')}</Text>
                    </Center>
                  ),
                  value: 'all',
                },
                ...REACTIONS.filter((type) =>
                  reactions.map((r) => r.type).includes(type)
                ).map((r) => ({
                  value: r,
                  label: (
                    <Center>
                      <Indicator
                        color='transparent'
                        c='red'
                        position='bottom-start'
                        label={
                          reactions.filter((reaction) => reaction.type === r)
                            .length
                        }
                      >
                        {/* <Icon
                          style={{ flex: 1 }}
                          icon={getReactionIconData(r).icon}
                          color={getReactionIconData(r).color}
                        /> */}
                        <Image src={emojis[r]} />
                      </Indicator>
                    </Center>
                  ),
                })),
              ]}
              flex={1}
            />

            <ScrollAreaAutosize mah='60vh'>
              <Stack py='md' px='sm'>
                {type === 'all'
                  ? reactions.map((r) => <ReactionStat r={r} key={r.id} />)
                  : reactions
                      .filter((r) => r.type === type)
                      .map((r) => <ReactionStat r={r} key={r.id} />)}
              </Stack>
            </ScrollAreaAutosize>
          </>
        ) : (
          <Alert title={t('no_reactions_yet')}>
            {t('no_reactions_yet_description')}
          </Alert>
        )}
      </Modal>
    </>
  );
};
