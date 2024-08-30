import {
  Popover,
  Group,
  ActionIcon,
  rem,
  useMantineTheme,
  TextInput,
  ThemeIcon,
  Menu,
  Stack,
  Badge,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import classes from './post.module.css';
import { useTranslation } from 'react-i18next';
import { useFetcher, Link } from '@remix-run/react';
import { tag } from '~/.server/db/schema';

export const Reactions = () => {
  const theme = useMantineTheme();
  const fetcher = useFetcher();
  const submitReaction = (type: string) => {
    console.log(type);
  };
  const reactions: { icon: string; color: string; type: string }[] = [
    { icon: 'ic:twotone-favorite-border', color: 'red', type: 'love' },
    { icon: 'akar-icons:thumbs-up', color: 'green', type: 'like' },
    { icon: 'fluent:emoji-laugh-16-regular', color: 'teal', type: 'haha' },
    { icon: 'lets-icons:sad-light', color: 'dark', type: 'sad' },
    { icon: 'lets-icons:wow', color: 'violet', type: 'wow' },
    { icon: 'lets-icons:angry', color: 'red', type: 'angry' },
    { icon: 'akar-icons:thumbs-down', color: 'green', type: 'dislike' },
  ];
  return (
    <fetcher.Form>
      <Popover>
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
              <ThemeIcon
                onClick={() => submitReaction(r.type)}
                component={ActionIcon}
                color={r.color}
                variant='light'
                bd={0}
                key={r.type}
              >
                <Icon icon={r.icon} />
              </ThemeIcon>
            ))}
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
              style={{ width: rem(32), height: rem(32) }}
              className={i18n.language === 'ar' ? 'rotate-180' : ''}
            />
          </ActionIcon>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export const CommentActions = () => {
  const { t } = useTranslation();
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon className={classes.menuIcon} variant='subtle'>
          <Icon icon='lets-icons:meatballs-menu' />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<Icon icon='lets-icons:edit-light' />}>
          {t('edit')}
        </Menu.Item>
        <Menu.Item leftSection={<Icon icon='lets-icons:trash-light' />}>
          {t('delete')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export const PostTags = ({ tags }: { tags: (typeof tag.$inferSelect)[] }) => {
  return (
    <Popover>
      <Popover.Target>
        <ActionIcon>
          <Icon icon='hugeicons:tags' />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Group align='center'>
          {tags.map((tag) => (
            <Badge
              style={{ cursor: 'pointer' }}
              component={Link}
              to={`?tag=${tag?.name}`}
              key={tag?.id}
              radius='sm'
            >
              {tag?.name}
            </Badge>
          ))}
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};
