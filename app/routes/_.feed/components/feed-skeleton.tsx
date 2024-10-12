import { Card, Divider, Group, rem, Skeleton, Stack } from '@mantine/core';
import { ITEMS_PER_PAGE } from '~/lib/constants';

export const FeedSkeleton = () => {
  return (
    <>
      <Stack>
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
          <PostSkeleton key={idx} />
        ))}
      </Stack>
    </>
  );
};

export const PostSkeleton = () => (
  <Card withBorder>
    <Stack>
      <Card.Section>
        <Skeleton h={rem(180)} />
      </Card.Section>
      <Skeleton h={22} className='w-3/5' />
      <Stack gap='xs'>
        <Skeleton w='100%' h={14} />
        <Skeleton w='100%' h={14} />
        <Skeleton w='100%' h={14} />
        <Skeleton w='70%' h={14} />
      </Stack>
      <Group justify='end'>
        <Skeleton w='92' h={18} radius='lg' />
      </Group>
      <Group justify='space-between'>
        <Group>
          <Skeleton w={38} h={38}></Skeleton>
          <Skeleton w={96} h={16} />
        </Group>
        <Group>
          <Skeleton w={26} h={26} />
          <Skeleton w={26} h={26} />
          <Skeleton w={26} h={26} />
        </Group>
      </Group>
      <Card.Section
        py='xs'
        px='lg'
        bg='light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7))'
      >
        <Group justify='space-between'>
          <Group>
            <Skeleton w={26} h={26} />
          </Group>
          <Group gap={0}>
            <Skeleton h={26} w={66} radius={0} />
            <Divider orientation='vertical' />
            <Skeleton h={26} w={66} radius={0} />
          </Group>
        </Group>
      </Card.Section>
    </Stack>
  </Card>
);
