// 'use client';
import React from 'react';
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
  List,
  Avatar,
  Text,
  Divider,
  ListItem,
  Badge,
  CopyButton,
  Tooltip,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import classes from './post.module.css';
import { useTranslation } from 'react-i18next';
import { useFetcher, Link } from '@remix-run/react';
import { tag } from '~/.server/db/schema';
import { fullName } from '~/lib/utils';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
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
      <button onClick={(e) => e.stopPropagation()}>
        <Popover.Target>
          <ActionIcon variant='subtle'>
            <Icon icon='hugeicons:tags' />
          </ActionIcon>
        </Popover.Target>
      </button>
      <Popover.Dropdown>
        <Group align='center' wrap='wrap'>
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

export const Comments = ({
  comments,
}: {
  comments: SerializeFrom<typeof loader>['posts'][0]['comments'];
  // comments: (typeof comment.$inferSelect & {
  //   user: typeof user.$inferSelect;
  //   reactions: (typeof commentReaction.$inferSelect)[];
  // })[];
}) => {
  return (
    <List icon={<ThemeIcon></ThemeIcon>}>
      {comments.map((comment) => (
        <React.Fragment key={comment.id}>
          <ListItem
            className={classes.comment}
            icon={
              <Avatar
                radius='md'
                src={comment.user.profileImage}
                name={fullName(comment.user)}
                color='initials'
              />
            }
          >
            <Text>{comment.content}</Text>

            <CommentActions />
            <Text fz='xs' c='dimmed'>
              {fullName(comment.user)}
            </Text>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

export const CopyContent = ({ value }: { value: string }) => {
  const { t } = useTranslation();
  return (
    <CopyButton value={value}>
      {({ copy, copied }) => (
        <Tooltip label={copied ? t('copied') : t('copy_content')}>
          <ActionIcon
            onClick={(e) => {
              console.log({ copy, copied });
              copy();
              e.stopPropagation();
            }}
            variant='subtle'
          >
            <Icon icon='lets-icons:copy-alt-light' />
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};
