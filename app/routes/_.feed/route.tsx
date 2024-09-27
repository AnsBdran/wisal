import { Drawer, Group, Modal, Pagination, Stack } from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Post from '~/lib/components/post/';
import { INTENTS, ITEMS_PER_PAGE } from '~/lib/constants';
import { getPosts } from '~/.server/queries';
import { authenticator } from '~/services/auth.server';
import { comment, commentUpdate, deleteComment, post, react } from './actions';
import { FeedFilters } from './filters';
import { CreatePostForm, EmptyFeed, PostForm, ScrollToTop } from './bits';
import { authenticateOrToast } from '~/.server/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  // const searchQueries = Object.fromEntries(url.searchParams);
  // try {
  // }

  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;
  const posts = await getPosts({
    page,
    userID: user?.id,
    //  searchQueries,
  });

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
  const [postFormOpened, { close: postFormClose, open: postFormOpen }] =
    useDisclosure();

  const [activePage, setActivePage] = useState<number>(
    page ? parseInt(page) : 1
  );

  return (
    <>
      <Stack hidden={posts.count === 0}>
        <Group justify='end'>
          <CreatePostForm open={postFormOpen} />
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

      <EmptyFeed hidden={posts.count > 0} open={postFormOpen} />

      {/* ++++++++++++++++++++++++++++++++++++++++++++++ */}
      {/* Modals and Drawers */}
      {/* post form */}
      <Drawer
        opened={postFormOpened}
        onClose={postFormClose}
        title={t('create_the_first_post')}
        hiddenFrom='sm'
        position='top'
        size='lg'
      >
        <PostForm />
      </Drawer>

      <Modal opened={postFormOpened} onClose={postFormClose} visibleFrom='sm'>
        <PostForm />
      </Modal>

      {/* filters */}
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
      <ScrollToTop />
    </>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = await authenticator.isAuthenticated(request);
  const userID = Number(user?.id);
  const intent = String(formData.get('intent'));

  switch (intent) {
    case INTENTS.react:
      return await react(formData, userID);
    case INTENTS.comment:
      return await comment(formData, userID);
    case INTENTS.updateComment:
      return await commentUpdate(formData);
    case INTENTS.deleteComment:
      return await deleteComment(formData);
    case INTENTS.post:
      return await post(formData, userID);
  }
};

export default Feed;
