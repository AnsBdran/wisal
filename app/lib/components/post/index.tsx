// import React from 'react';
// import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';
import {
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Avatar,
  useMantineTheme,
  Popover,
  Stack,
  Accordion,
  ListItem,
  List,
  ThemeIcon,
  Center,
  Divider,
  Menu,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from './post.module.css';
import { Icon } from '@iconify/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { useTranslation } from 'react-i18next';
import { Link } from '@remix-run/react';
import { Comment, CommentActions, PostTags, Reactions } from './bits';
import { fullName } from '~/lib/utils';
import React, { useState } from 'react';
import { tag } from '~/.server/db/schema';

export default function Post({
  post,
}: {
  post: SerializeFrom<typeof loader>['posts'][0];
}) {
  const { t } = useTranslation();
  const linkProps = {
    href: 'https://mantine.dev',
    target: '_blank',
    rel: 'noopener noreferrer',
  };
  const theme = useMantineTheme();
  const [commentsOpened, setCommentsOpened] = useState(false);

  return (
    <Card withBorder radius='md' className={classes.card}>
      {!!post.images.length && (
        <Card.Section className={classes.image}>
          <Carousel
            withIndicators={post.images.length > 1}
            withControls={false}
            loop
            classNames={{
              root: classes.carousel,
              // controls: classes.carouselControls,
              indicator: classes.carouselIndicator,
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

      <Text className={classes.title} fw={500} component='a' {...linkProps}>
        {post.title}
      </Text>

      <Text fz='sm' c='dimmed' lineClamp={4}>
        {post.content}
      </Text>

      <Group justify='space-between' mt='md'>
        <Group className={classes.user} justify='space-between' align='center'>
          <Avatar src={post.user.profileImage} size={24} radius='xl' />
          <Text fz='sm' inline>
            {fullName(post.user)}
          </Text>
        </Group>
        <Group gap={8} mr={0}>
          <Reactions />
          <Comment />

          <ActionIcon className={classes.action}>
            <Icon
              icon='material-symbols:share-windows-rounded'
              color={theme.colors.blue[6]}
            />
          </ActionIcon>
        </Group>
        {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
        {/* Tags +++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      </Group>

      {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      {/* Footer +++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

      <Card.Section className={classes.footer}>
        <Accordion w='100%' unstyled chevron>
          <Accordion.Item value='comments'>
            <Accordion.Control w='100%'>
              <Group justify='space-between' px='md' py='xs'>
                <Group>
                  {/* copy button */}
                  <ActionIcon disabled>
                    <Icon icon='lets-icons:copy-alt-light' />
                  </ActionIcon>
                  <PostTags
                    tags={
                      post.tags.map((t) => t.tag) as (typeof tag.$inferSelect)[]
                    }
                  />
                </Group>
                <Text fz='xs' c='dimmed'>
                  878 {t('reacted_to_this')}
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel className={classes.commentsContainer}>
              <List icon={<ThemeIcon></ThemeIcon>}>
                {post.comments.map((comment) => (
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card.Section>
    </Card>
  );
}
