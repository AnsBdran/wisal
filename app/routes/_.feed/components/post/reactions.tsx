// 'use client';
import {
  Popover,
  Group,
  ActionIcon,
  rem,
  Stack,
  Text,
  Center,
  Box,
  SegmentedControl,
  Modal,
  Indicator,
  ScrollAreaAutosize,
  Alert,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
import { getReactionIconData, getProfileInfo } from '~/lib/utils';
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
                    ? 'light'
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
                // className={`${r === 'dislike' ? 'rotate-180' : ''} ${
                //   r === 'like' ? 'flip' : ''
                // }`}
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
  reactions: SerializeFrom<typeof loader>['posts']['data'][0]['reactions'];
}) => {
  const { t } = useTranslation('feed');
  const [type, setType] = useState('all');

  const ReactionStat = ({
    r,
  }: {
    r: SerializeFrom<typeof loader>['posts']['data'][0]['reactions'][0];
  }) => {
    return (
      <Box>
        <Group>
          <Indicator
            label={<Icon icon={getReactionIconData(r.type).icon} />}
            color='transparent'
            size={24}
          >
            {getProfileInfo(r.user)}
          </Indicator>
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
                        position='bottom-start'
                        label={
                          reactions.filter((reaction) => reaction.type === r)
                            .length
                        }
                      >
                        <Icon
                          style={{ flex: 1 }}
                          icon={getReactionIconData(r).icon}
                          color={getReactionIconData(r).color}
                        />
                      </Indicator>
                    </Center>
                  ),
                })),
              ]}
              flex={1}
            />
            <ScrollAreaAutosize mah={500} py='xl'>
              <Stack py='xl' px='sm'>
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
