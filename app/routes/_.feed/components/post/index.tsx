import {
  Card,
  Image,
  Text,
  ActionIcon,
  Group,
  useMantineTheme,
  Highlight,
  Badge,
  Modal,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import styles from './post.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { Reactions, ReactionsStats } from './reactions';
import { AllComments, AddComment } from './comment';
import { PostFooter } from './post-footer';
import { fromNow, getProfileInfo } from '~/lib/utils';
import { useState } from 'react';
import { Icons } from '~/lib/icons';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { EditPost } from './edit';
import { useDisclosure } from '@mantine/hooks';
import { PostActions } from './actions';
import { useTranslations, useLocale } from 'use-intl';

export default function Post({
  post,
  userID,
}: {
  post: SerializeFrom<typeof loader>['posts']['data'][0];
  userID: number;
}) {
  const theme = useMantineTheme();
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [opened, { toggle, open }] = useDisclosure();

  const commentsFetcher = useFetcher();
  const reactionsFetcher = useFetcher();
  const t = useTranslations('common');
  const locale = useLocale();
  const [
    editPostFormOpened,
    { open: editPostFormOpen, close: editPostFormClose },
  ] = useDisclosure();

  return (
    <Card withBorder radius='md' className={styles.card}>
      {!!post.images.length && (
        <Card.Section>
          <Carousel
            withIndicators={post.images.length > 1}
            withControls={false}
            loop
            classNames={{
              root: styles.carousel,
              indicator: styles.carouselIndicator,
            }}
          >
            {post.images.map((image, i) => (
              <Carousel.Slide key={image.id} className={styles.image}>
                <Image src={post.images[i]?.url} height={180} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Card.Section>
      )}

      <Text className={styles.title} fw={500}>
        {post.title}
      </Text>

      <Highlight c='dimmed' lineClamp={4} fz='sm' highlight={['بدران', 'أنس']}>
        {post.content}
      </Highlight>

      <Group justify='end'>
        <Badge fz='xs' c={'dimmed'} variant='dot'>
          {fromNow(post.createdAt, locale)}
        </Badge>
      </Group>
      <Group justify='space-between' mt='md'>
        <Group flex={1}>
          {getProfileInfo(post.user)}
          <PostActions
            post={post}
            userID={userID}
            editPostFormOpen={editPostFormOpen}
          />
        </Group>
        <Group gap={8} mr={0}>
          <Reactions post={post} />
          <AddComment postID={post.id} openFirstFive={open} />

          <ActionIcon className={styles.action}>
            <Icons.share color={theme.colors.blue[6]} />
          </ActionIcon>
        </Group>
      </Group>

      <Card.Section>
        <PostFooter
          onShowCommentsBtnClicked={(e) => {
            commentsFetcher.load(
              `/api/data?intent=${INTENTS.fetchComments}&postID=` + post.id
            );
            e.stopPropagation();
            setShowAllComments(true);
          }}
          showCommentsBtnLoading={commentsFetcher.state === 'loading'}
          onShowReactionsBtnClicked={(e) => {
            reactionsFetcher.load(
              `/api/data?intent=${INTENTS.fetchReactions}&postID=${post.id}`
            );
            e.stopPropagation();
            setShowAllReactions(true);
          }}
          showReactionsBtnLoading={reactionsFetcher.state === 'loading'}
          post={post}
          userID={userID}
          opened={opened}
          toggle={toggle}
        />
      </Card.Section>

      {/* comments and reactions overlays */}
      <ReactionsStats
        opened={showAllReactions && reactionsFetcher.state === 'idle'}
        close={() => setShowAllReactions(false)}
        reactions={reactionsFetcher.data?.reactions ?? []}
      />
      <AllComments
        opened={showAllComments && commentsFetcher.state === 'idle'}
        close={() => setShowAllComments(false)}
        comments={commentsFetcher.data?.comments ?? []}
        userID={userID}
      />

      {post.userID === userID && (
        <Modal
          title={t('edit_post')}
          opened={editPostFormOpened}
          onClose={editPostFormClose}
        >
          <EditPost
            post={post}
            userID={userID}
            editPostFormClose={editPostFormClose}
          />
        </Modal>
      )}
    </Card>
  );
}
