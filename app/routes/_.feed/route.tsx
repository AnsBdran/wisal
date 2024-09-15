import {
  ActionIcon,
  Drawer,
  Group,
  Modal,
  Pagination,
  Stack,
} from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Post from '~/lib/components/post/';
import { INTENTS, ITEMS_PER_PAGE } from '~/lib/constants';
import { getPosts } from '~/.server/queries';
import { authenticator } from '~/services/auth.server';
import { comment, commentUpdate, deleteComment, react } from './actions';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { FeedFilters } from './filters';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const searchQueries = Object.fromEntries(url.searchParams);

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const posts = await getPosts({ page, searchQueries, userID: user?.id });

  return json({
    posts,
    user,
  });
};

const Feed = () => {
  const { posts, user } = useLoaderData<typeof loader>();
  const { t } = useTranslation('feed');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
  const [opened, { close, open }] = useDisclosure();
  const [activePage, setActivePage] = useState<number>(
    page ? parseInt(page) : 1
  );

  return (
    <>
      <Stack>
        <Group justify='end'>
          <ActionIcon>
            <Icon icon={icons.add} />
          </ActionIcon>
          <ActionIcon onClick={open}>
            <Icon icon={icons.filter} />
          </ActionIcon>
        </Group>
        <Stack>
          {posts.data.map((post) => (
            <Post post={post} key={post.id} userID={user.id} />
          ))}
        </Stack>
        <Pagination
          total={Math.ceil(posts.count / ITEMS_PER_PAGE)}
          value={activePage}
          onChange={(page) => {
            navigate(`?page=${page}`, { preventScrollReset: true });
            setActivePage(page);
          }}
          hideWithOnePage
        />
      </Stack>

      <Drawer
        opened={opened}
        onClose={close}
        position='bottom'
        title={t('filter_content')}
        hiddenFrom='sm'
        size='lg'
      >
        <FeedFilters />
      </Drawer>
      <Modal h={800} size='lg' opened={opened} onClose={close} visibleFrom='sm'>
        <FeedFilters />
      </Modal>
      {/* scroll to top button */}
      {/* <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 120}>
          {(transitionStyles) => (
            <Tooltip label={t('scroll_to_top')}>
              <ActionIcon
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
                variant='light'
              >
                <Icon icon={icons.arrowUp} />
              </ActionIcon>
            </Tooltip>
          )}
        </Transition>
      </Affix> */}
    </>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = await authenticator.isAuthenticated(request);
  const intent = String(formData.get('intent'));
  const postID = String(formData.get('postID'));
  const content = String(formData.get('content'));
  const commentID = Number(formData.get('commentID'));

  switch (intent) {
    case INTENTS.react:
      return await react(formData.get('type'), postID, user?.id);
    case INTENTS.comment:
      return await comment(content, parseInt(postID), user!.id);
    case INTENTS.updateComment: {
      const res = await commentUpdate(
        formData.get('content') as string,
        commentID
      );
      return res;
    }
    case INTENTS.deleteComment:
      return await deleteComment(commentID);
  }

  // return null;
};

export default Feed;
