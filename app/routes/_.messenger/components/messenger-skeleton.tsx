import { alpha, Box, Group, Skeleton, Stack } from '@mantine/core';
import { ITEMS_PER_PAGE } from '~/lib/constants';

export const MessengerSkeleton = () => (
  <>
    {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
      <ChatSkeleton key={idx} />
    ))}
  </>
);

export const ChatSkeleton = () => (
  <Stack
    p='xs'
    style={{
      border: '2px solid',
      borderColor: alpha('gray', 0.3),
      borderRadius: 'var(--mantine-radius-md)',
    }}
    py='xs'
    px='md'
    gap='xs'
    my='xs'
  >
    <Group justify='space-between'>
      <Group className='w-5/6'>
        <Skeleton h={38} w={38} />
        <Skeleton h={20} className='w-2/5' />
      </Group>
      <Skeleton w={12} h={4} />
    </Group>
    <Group justify='space-between'>
      <Skeleton className='w-3/5' h={14} />
      <Skeleton h={26} className='w-1/5' />
    </Group>
  </Stack>
);
