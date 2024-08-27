import {
  Avatar,
  Badge,
  Box,
  Card,
  Group,
  Image,
  List,
  Spoiler,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { SerializeFrom } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import { fromNow } from '~/lib/utils';
const Post = ({ post }: { post: SerializeFrom<typeof loader> }) => {
  const { i18n } = useTranslation();
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Box>
        <Group justify='space-between' align='center'>
          <Group>
            <Avatar display='2' src={post.user.profileImage}>
              {post.user.firstName.charAt(0)} {post.user.lastName.charAt(0)}
            </Avatar>
            <Title order={4} c='cyan.4'>
              {post.user.firstName} {post.user.lastName}
            </Title>
          </Group>
          <Badge variant='outline'>
            {fromNow(post.createdAt, i18n.language)}
          </Badge>
        </Group>
        <Title order={4} c='lime'>
          {post.title}
        </Title>
        <Text c='teal.4' className='text-xs'>
          {post.content}
        </Text>
        <Spoiler hideLabel='إخفاء' showLabel='إظهار المزيد'>
          <List>
            {post.comments.map((comment) => (
              <List.Item key={comment.id} c='grape.6'>
                {comment.user.firstName} =&gt; {comment.content}
              </List.Item>
            ))}
          </List>
        </Spoiler>
      </Box>
    </Card>
  );
};

export default Post;
