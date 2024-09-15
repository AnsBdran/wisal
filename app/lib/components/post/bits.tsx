import {
  Popover,
  Group,
  ActionIcon,
  useMantineTheme,
  Badge,
  CopyButton,
  Tooltip,
  Button,
  Box,
  UnstyledButton,
  Collapse,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import styles from './post.module.css';
import { useTranslation } from 'react-i18next';
import { Link } from '@remix-run/react';
import { tag } from '~/.server/db/schema';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { icons } from '~/lib/icons';
import { useDisclosure } from '@mantine/hooks';
import { Comments } from './comment';

export * from './comment';
export * from './reactions';

export const PostTags = ({ tags }: { tags: (typeof tag.$inferSelect)[] }) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover>
        <Popover.Target>
          <ActionIcon variant='subtle'>
            <Icon icon={icons.tags} />
          </ActionIcon>
        </Popover.Target>
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
    </div>
  );
};

export const CopyContentBtn = ({ value }: { value: string }) => {
  const { t } = useTranslation();
  return (
    <CopyButton value={value}>
      {({ copy, copied }) => (
        <Tooltip label={copied ? t('copied') : t('copy_content')}>
          <ActionIcon
            onClick={(e) => {
              e.stopPropagation();
              copy();
            }}
            variant='subtle'
          >
            <Icon icon={icons.copy} />
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export const PostFooter = ({
  post,
  onShowCommentsBtnClicked,
  showCommentsBtnLoading,
  onShowReactionsBtnClicked,
  showReactionsBtnLoading,
  userID,
}: {
  post: SerializeFrom<typeof loader>['posts']['data'][0];
  onShowCommentsBtnClicked: (e: unknown) => void;
  showCommentsBtnLoading: boolean;
  onShowReactionsBtnClicked: (e: unknown) => void;
  showReactionsBtnLoading: boolean;
  userID: number;
}) => {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  const { t } = useTranslation();
  return (
    <>
      <UnstyledButton
        onClick={toggle}
        className={styles.footer}
        bg={
          opened
            ? `light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[9]})`
            : undefined
        }
      >
        <Group>
          {/* copy button */}
          <CopyContentBtn value={post.content} />
          <PostTags
            // tags={post.tags}
            tags={post.tags.map((t) => t.tag) as (typeof tag.$inferSelect)[]}
          />
        </Group>
        <Box>
          <Button.Group opacity={0.7}>
            <Button
              onClick={onShowCommentsBtnClicked}
              size='compact-sm'
              loading={showCommentsBtnLoading}
              loaderProps={{ type: 'dots' }}
            >
              {t('comments')}
            </Button>
            <Button
              onClick={onShowReactionsBtnClicked}
              size='compact-sm'
              loading={showReactionsBtnLoading}
              loaderProps={{
                type: 'dots',
              }}
            >
              {t('reactions')}
            </Button>
          </Button.Group>
        </Box>
      </UnstyledButton>

      <Collapse in={opened} className={styles.commentsContainer}>
        <Comments comments={post.comments} userID={userID} />
        <Button w='100%' onClick={onShowCommentsBtnClicked}>
          {t('view_all_comments')}
        </Button>
      </Collapse>
    </>
  );
};
