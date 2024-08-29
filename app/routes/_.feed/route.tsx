import {
  ActionIcon,
  Affix,
  Button,
  Pagination,
  Stack,
  Tooltip,
  Transition,
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { Icon } from '@iconify/react';
import Post from '~/lib/components/post/';
import { count } from 'drizzle-orm';
import { post } from '~/.server/db/schema';
import { ITEMS_PER_PAGE } from '~/lib/constants';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page');
  const offset = ((page ? parseInt(page) : 1) - 1) * ITEMS_PER_PAGE;

  // filters
  const tag = url.searchParams.get('tag');

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
      reactions: {
        with: {
          user: true,
        },
      },
      user: true,
      images: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
    limit: ITEMS_PER_PAGE,
    offset,
    // where(fields, operators) {
    //     fields.
    // },
  });
  return json({
    posts,
    count: (await db.select({ count: count() }).from(post))[0].count,
  });
};

const Feed = () => {
  const { posts, count } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
  const [activePage, setActivePage] = useState<number>(
    page ? parseInt(page) : 1
  );
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <>
      <Pagination
        total={Math.ceil(count / ITEMS_PER_PAGE)}
        value={activePage}
        onChange={(page) => {
          navigate(`?page=${page}`, { preventScrollReset: true });
          setActivePage(page);
        }}
        hideWithOnePage
      />
      <Stack pt='xl'>
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Stack>
      <Pagination
        total={Math.ceil(count / ITEMS_PER_PAGE)}
        value={activePage}
        onChange={(page) => {
          navigate(`?page=${page}`, { preventScrollReset: true });
          setActivePage(page);
        }}
        hideWithOnePage
      />
      {/* scroll to top button */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 120}>
          {(transitionStyles) => (
            <Tooltip label={t('scroll_to_top')}>
              <ActionIcon
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
                variant='light'
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

export const action = async () => {};

export default Feed;
