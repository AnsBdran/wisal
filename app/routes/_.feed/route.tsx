import {
  Box,
  Modal,
  Pagination,
  ScrollArea,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionFunctionArgs, defer, LoaderFunctionArgs } from '@remix-run/node';
import { Await, useLoaderData, useNavigate } from '@remix-run/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Post from '~/routes/_.feed/components/post';
import {
  BOTTOM_BAR_HEIGHT,
  HEADER_HEIGHT,
  INTENTS,
  ITEMS_PER_PAGE,
} from '~/lib/constants';
import { getPosts } from '~/.server/queries';
import { authenticator } from '~/services/auth.server';
import {
  comment,
  commentUpdate,
  deleteComment,
  deletePost,
  editPost,
  post,
  react,
} from './actions';
import { EmptyFeed, PostForm } from './components';
import { authenticateOrToast } from '~/.server/utils';
import AppIntro from './components/app-intro';
import { FeedHeader } from './components/feed-header';
import { FeedSkeleton } from './components/feed-skeleton';
import { useTranslations } from 'use-intl';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const { user, loginRedirect } = await authenticateOrToast(request);
  if (!user) return loginRedirect;

  const postsPromise = getPosts({
    page,
    userID: user?.id,
  });

  return defer({
    posts: postsPromise,
    user,
    page,
  });
};

const Feed = () => {
  const { posts, user, page } = useLoaderData<typeof loader>();
  const t = useTranslations('feed');
  const navigate = useNavigate();
  const [postFormOpened, { close: postFormClose, open: postFormOpen }] =
    useDisclosure();
  const [introOpened, { close: introClose, toggle: introToggle }] =
    useDisclosure();

  const [activePage, setActivePage] = useState<number>(page);

  return (
    <>
      <Stack
        py='xs'
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px - ${BOTTOM_BAR_HEIGHT}px)`,
          overflow: 'hidden',
        }}
      >
        <FeedHeader
          introOpened={introOpened}
          postFormOpen={postFormOpen}
          toggleIntro={introToggle}
        />
        <AppIntro opened={introOpened} close={introClose} />

        <Suspense fallback={<FeedSkeleton />}>
          <Await resolve={posts}>
            {(posts) => {
              console.log('inside suspense rendered', posts);
              return (
                <>
                  <ScrollArea
                    styles={{
                      thumb: {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <SimpleGrid
                      cols={{ base: 1 }}
                      mb='md'
                      hidden={posts.count === 0}
                    >
                      {posts.data.map((post) => (
                        <Box key={post.id}>
                          <Post post={post} userID={user.id} />
                        </Box>
                      ))}
                    </SimpleGrid>
                    <Pagination
                      total={Math.ceil(posts.count / ITEMS_PER_PAGE)}
                      value={activePage}
                      onChange={(page) => {
                        navigate(`?page=${page}`, {
                          preventScrollReset: true,
                        });
                        setActivePage(page);
                      }}
                      hideWithOnePage
                    />
                    <EmptyFeed hidden={posts.count > 0} open={postFormOpen} />
                  </ScrollArea>
                </>
              );
            }}
          </Await>
        </Suspense>
      </Stack>

      {/* ++++++++++++++++++++++++++++++++++++++++++++++ */}
      {/* Modals and Drawers */}

      {/* post form */}
      <Modal
        title={t('create_new_post')}
        opened={postFormOpened}
        onClose={postFormClose}
        styles={{
          content: {
            overflow: 'hidden',
          },
        }}
      >
        <ScrollArea.Autosize mah={600} offsetScrollbars>
          <PostForm close={postFormClose} />
        </ScrollArea.Autosize>
      </Modal>

      {/* filters */}
      {/* <Drawer
        opened={opened}
        onClose={close}
        position='bottom'
        title={t('filter_content')}
        hiddenFrom='sm'
        size='lg'
      >
        <FeedFilters />
      </Drawer>
      <Modal size='lg' opened={opened} onClose={close} visibleFrom='sm'>
        <FeedFilters />
      </Modal> */}
      {/* <ScrollToTop /> */}
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
    case INTENTS.editPost:
      return await editPost(formData);
    case INTENTS.deletePost:
      return await deletePost(formData, request);
  }
};

export default Feed;
