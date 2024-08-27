// import { IconBookmark, IconHeart, IconShare } from '@tabler/icons-react';
import {
  Card,
  Image,
  Text,
  ActionIcon,
  Badge,
  Group,
  Center,
  Avatar,
  useMantineTheme,
  rem,
} from '@mantine/core';
import classes from './post.module.css';
import { Icon } from '@iconify/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed';

export default function Post({
  post,
}: {
  post: SerializeFrom<typeof loader>['posts'][0];
}) {
  const linkProps = {
    href: 'https://mantine.dev',
    target: '_blank',
    rel: 'noopener noreferrer',
  };
  const theme = useMantineTheme();

  return (
    <Card withBorder radius='md' className={classes.card}>
      <Card.Section>
        <a {...linkProps}>
          <Image src='https://i.imgur.com/Cij5vdL.png' height={180} />
        </a>
      </Card.Section>

      {/* <Badge
        className={classes.rating}
        variant='gradient'
        gradient={{ from: 'yellow', to: 'red' }}
      >
        outstanding
      </Badge> */}

      <Text className={classes.title} fw={500} component='a' {...linkProps}>
        {post.title}
      </Text>

      <Text fz='sm' c='dimmed' lineClamp={4}>
        {post.content}
      </Text>

      <Group justify='space-between' className={classes.footer}>
        <Center className='space-x-24'>
          <Avatar src={post.user.profileImage} size={24} radius='xl' />
          <Text fz='sm' inline>
            Bill Wormeater
          </Text>
        </Center>

        <Group gap={8} mr={0}>
          <ActionIcon className={classes.action}>
            <Icon
              icon='ic:twotone-favorite-border'
              color={theme.colors.red[6]}
              style={{ width: rem(16), height: rem(16) }}
            />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <Icon
              icon='mdi:comment-text-outline'
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.yellow[7]}
            />
          </ActionIcon>
          <ActionIcon className={classes.action}>
            <Icon
              icon='material-symbols:share-windows-rounded'
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.blue[6]}
            />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
    // <div>post</div>
  );
}
