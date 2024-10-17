import {
  Group,
  useMantineTheme,
  Button,
  UnstyledButton,
  Collapse,
} from '@mantine/core';
import styles from './post.module.css';
import { useTranslation } from 'react-i18next';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { Comments } from './comment';
import { CopyContentBtn } from './bits';

export const PostFooter = ({
  post,
  onShowCommentsBtnClicked,
  showCommentsBtnLoading,
  onShowReactionsBtnClicked,
  showReactionsBtnLoading,
  userID,
  opened,
  toggle,
}: {
  post: SerializeFrom<typeof loader>['posts']['data'][0];
  onShowCommentsBtnClicked: (e: unknown) => void;
  showCommentsBtnLoading: boolean;
  onShowReactionsBtnClicked: (e: unknown) => void;
  showReactionsBtnLoading: boolean;
  userID: number;
  opened: boolean;
  toggle: () => void;
}) => {
  // const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  const { t } = useTranslation();
  return (
    <>
      <UnstyledButton
        onClick={toggle}
        className={styles.footer}
        mt='lg'
        component={Group}
        style={{
          marginTop: 'auto',
          width: '100%',
          height: '48px',
        }}
        bg={
          opened
            ? `light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[9]})`
            : undefined
        }
      >
        <CopyContentBtn value={post.content} />
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
      </UnstyledButton>

      <Collapse in={opened} className={styles.commentsContainer}>
        <Comments comments={post.comments} userID={userID} />
        <Button
          w='100%'
          onClick={onShowCommentsBtnClicked}
          loading={showCommentsBtnLoading}
          loaderProps={{ type: 'dots' }}
          hidden={post.comments.length === 0}
        >
          {t('view_all_comments')}
        </Button>
      </Collapse>
    </>
  );
};
