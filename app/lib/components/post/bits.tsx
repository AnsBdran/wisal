import {
  Popover,
  Group,
  ActionIcon,
  rem,
  useMantineTheme,
  TextInput,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import classes from './post.module.css';
import { useTranslation } from 'react-i18next';
import { useFetcher } from '@remix-run/react';
export const Reactions = () => {
  const theme = useMantineTheme();
  const fetcher = useFetcher();
  const submitReaction = (type: string) => {};
  const reactions: { icon: string; color: string; type: string }[] = [
    { icon: 'ic:twotone-favorite-border', color: 'red', type: 'love' },
    { icon: 'akar-icons:thumbs-up', color: 'green', type: '' },
    { icon: 'fluent:emoji-laugh-16-regular', color: 'teal', type: '' },
    { icon: 'lets-icons:sad-light', color: '', type: '' },
    { icon: 'lets-icons:angry', color: 'red', type: '' },
    { icon: 'akar-icons:thumbs-down', color: 'green', type: '' },
  ];
  return (
    <fetcher.Form>
      <Popover opened>
        <Popover.Target>
          <ActionIcon className={classes.action}>
            <Icon
              icon='ic:twotone-favorite-border'
              color={theme.colors.red[6]}
              style={{ width: rem(16), height: rem(16) }}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Group>
            {reactions.map((r) => (
              <ActionIcon key={r.type} color={r.color} c='' variant='light'>
                <Icon icon={r.icon} />
              </ActionIcon>
            ))}
            {/* <ActionIcon
              variant='light'
              color='blue'
              onClick={() => submitReaction('like')}
            >
              <Icon icon='akar-icons:thumbs-up' />
            </ActionIcon>
            <ActionIcon
              autoContrast
              variant='filled'
              color='yellow.6'
              onClick={() => submitReaction('haha')}
            >
              <Icon icon='fluent:emoji-laugh-16-regular' />
            </ActionIcon>
            <ActionIcon
              variant='light'
              color='dark'
              onClick={() => submitReaction('sad')}
            >
              <Icon icon='lets-icons:sad-light' />
            </ActionIcon>
            <ActionIcon
              variant='filled'
              color='red'
              onClick={() => submitReaction('love')}
            >
              <Icon icon='ic:twotone-favorite-border' />
            </ActionIcon>
            <ActionIcon
              variant='light'
              color='red'
              onClick={() => submitReaction('angry')}
            >
              <Icon icon='lets-icons:angry' />
            </ActionIcon>
            <ActionIcon
              variant='light'
              onClick={() => submitReaction('dislike')}
            >
              <Icon icon='akar-icons:thumbs-down' />
            </ActionIcon> */}
          </Group>
        </Popover.Dropdown>
      </Popover>
    </fetcher.Form>
  );
};

export const Comment = () => {
  const { i18n, t } = useTranslation();
  const theme = useMantineTheme();
  return (
    <Popover>
      <Popover.Target>
        <ActionIcon className={classes.action}>
          <Icon
            icon='mdi:comment-text-outline'
            // style={{ width: rem(16), height: rem(16) }}
            color={theme.colors.yellow[7]}
          />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Group align='end' gap='xs'>
          <TextInput placeholder={t('comment_placeholder')} variant='filled' />
          <ActionIcon size='lg' variant='filled'>
            <Icon
              icon='lets-icons:send-hor-light'
              // style={{ width: rem(24), height: rem(24) }}
              className={i18n.language === 'ar' ? 'rotate-180' : ''}
            />
          </ActionIcon>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};
