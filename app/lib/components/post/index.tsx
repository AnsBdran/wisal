import {
  Card,
  Image,
  Text,
  ActionIcon,
  Group,
  Avatar,
  useMantineTheme,
  Highlight,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import styles from './post.module.css';
import { Icon } from '@iconify/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import {
  AllComments,
  AddComment,
  PostFooter,
  Reactions,
  ReactionsStats,
} from './bits';
import { fromNow, getFullName } from '~/lib/utils';
import { useState } from 'react';
import { icons } from '~/lib/icons';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';

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
  const commentsFetcher = useFetcher();
  const reactionsFetcher = useFetcher();
  // const data = useActionData();
  // const postData = useRouteLoaderData<typeof postDataLoader>(
  //   'routes/api.post-data'
  // );

  return (
    <Card withBorder radius='md' className={styles.card}>
      {!!post.images.length && (
        <Card.Section className={styles.image}>
          <Carousel
            withIndicators={post.images.length > 1}
            withControls={false}
            loop
            classNames={{
              root: styles.carousel,
              // controls: styles.carouselControls,
              indicator: styles.carouselIndicator,
            }}
          >
            {post.images.map((image, i) => (
              <Carousel.Slide key={image.id}>
                <Image src={post.images[i]?.url} height={180} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </Card.Section>
      )}

      <Text className={styles.title} fw={500}>
        {post.title} {fromNow(post.createdAt, 'ar')}
      </Text>

      <Text fz='sm' c='dimmed' lineClamp={4}>
        <Highlight highlight='حر'>{post.content}</Highlight>
      </Text>

      <Group justify='space-between' mt='md'>
        <Group className={styles.user} justify='space-between' align='center'>
          <Avatar src={post.user.profileImage} size={24} radius='xl' />
          <Text fz='sm' inline>
            {getFullName(post.user)}
          </Text>
        </Group>
        <Group gap={8} mr={0}>
          <Reactions post={post} />
          <AddComment postID={post.id} />

          <ActionIcon className={styles.action}>
            <Icon icon={icons.share} color={theme.colors.blue[6]} />
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
    </Card>
  );
}
