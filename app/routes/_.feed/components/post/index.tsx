import {
  Card,
  Image,
  Text,
  ActionIcon,
  Group,
  Avatar,
  useMantineTheme,
  Highlight,
  Badge,
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
import { fromNow, getProfileInfo, getProfileInfoText } from '~/lib/utils';
import { useState } from 'react';
import { icons } from '~/lib/icons';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { useTranslation } from 'react-i18next';

export default function Post({
  post,
  userID,
}: // locale,
{
  post: SerializeFrom<typeof loader>['posts']['data'][0];
  userID: number;
  // locale: 'en' | 'ar';
}) {
  const theme = useMantineTheme();
  const [showAllComments, setShowAllComments] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const commentsFetcher = useFetcher();
  const reactionsFetcher = useFetcher();
  const { i18n } = useTranslation();
  // const data = useActionData();
  // const postData = useRouteLoaderData<typeof postDataLoader>(
  //   'routes/api.post-data'
  // );

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
              // controls: styles.carouselControls,
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

      <Text fz='sm' c='dimmed' lineClamp={4}>
        <Highlight highlight={['بدران', 'أنس']}>{post.content}</Highlight>
      </Text>

      {/* <Text fz='xs' c={'dimmed'}>
        {fromNow(post.createdAt, locale)}
      </Text> */}
      <Group justify='end'>
        <Badge fz='xs' c={'dimmed'} variant='dot'>
          {fromNow(post.createdAt, i18n.language)}
        </Badge>
      </Group>
      <Group justify='space-between' mt='md'>
        <Group justify='space-between' flex={1}>
          {getProfileInfo(post.user)}
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
