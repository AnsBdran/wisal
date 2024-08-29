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
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from './post.module.css';
import { Icon } from '@iconify/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { useTranslation } from 'react-i18next';
import { Link } from '@remix-run/react';
import { Comment, Reactions } from './bits';

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

  return (
    <Card withBorder radius='md' className={classes.card}>
      {!!post.images.length && (
        <Card.Section className={classes.image}>
          <Carousel
            withIndicators={post.images.length > 1}
            withControls
            loop
            classNames={{
              root: classes.carousel,
              controls: classes.carouselControls,
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
        <Popover>
          <Popover.Target>
            <ActionIcon>
              <Icon icon='hugeicons:tags' />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack align='center'>
              {post.tags.map((t) => (
                <Badge
                  style={{ cursor: 'pointer' }}
                  component={Link}
                  to={`?tag=${t.tag?.name}`}
                  key={t.tag?.id}
                >
                  {t.tag?.name}
                </Badge>
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Group>
      {/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}
      {/* Footer +++++++++++++++++++++++++++++++++++++++++++++++++++++++ */}

      <Card.Section className={classes.footer}>
        <Accordion w='100%' unstyled chevron>
          <Accordion.Item value='comments'>
            <Accordion.Control w='100%'>
              <Group justify='space-between' px='md' py='xs'>
                <Group
                  className={classes.user}
                  justify='space-between'
                  align='center'
                >
                  <Avatar src={post.user.profileImage} size={24} radius='xl' />
                  <Text fz='sm' inline>
                    {post.user.firstName} {post.user.lastName}
                  </Text>
                </Group>
                <Text fz='xs' c='dimmed'>
                  878 {t('reacted_to_this')}
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <List bg='lime.1'>
                {post.comments.map((comment) => (
                  <ListItem key={comment.id}>
                    <Avatar src={comment.user.profileImage} />
                    <span>
                      {comment.user.firstName} {comment.user.lastName}
                    </span>{' '}
                    {comment.content}
                  </ListItem>
                ))}
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card.Section>
    </Card>
  );
}
