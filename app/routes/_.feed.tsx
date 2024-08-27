import {
  ActionIcon,
  Affix,
  Button,
  Stack,
  Tooltip,
  Transition,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { Icon } from '@iconify/react';
import Post from '~/lib/components/post/';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');
  // const {} = request.url.
  const posts = await db.query.post.findMany({
    with: {
      comments: {
        with: {
          reactions: {
            with: {
              user: true,
            },
          },
          user: true,
        },
      },
      // user: true,
      reactions: {
        with: {
          user: true,
        },
      },
      user: true,
    },

    limit: offset > 0 ? offset : 10,
  });
  return json({ posts });
};

const Feed = () => {
  const { posts } = useLoaderData<typeof loader>();
  // console.log('posts', posts);
  const [scroll, scrollTo] = useWindowScroll();
  const { t } = useTranslation();
  const [offset, setOffset] = useState<number>(0);
  const navigate = useNavigate();
  return (
    <>
      <Stack pt='xl'>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
        <Button
          onClick={() => {
            const newOffset = offset + 10;
            setOffset(newOffset);
            navigate(`?offset=${newOffset}`, { preventScrollReset: true });
          }}
        >
          {t('load_more')}
        </Button>
      </Stack>

      {/* scroll to top button */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 120}>
          {(transitionStyles) => (
            <Tooltip label={t('scroll_to_top')}>
              <ActionIcon
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                <Icon icon='ph:caret-double-up-bold' />
              </ActionIcon>
            </Tooltip>
          )}
        </Transition>
      </Affix>
    </>
  );
};

export default Feed;
