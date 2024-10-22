// import {
//   Box,
//   Modal,
//   Pagination,
//   ScrollArea,
//   SimpleGrid,
//   Text,
//   Stack,
// } from '@mantine/core';
// import { useDisclosure, useInViewport } from '@mantine/hooks';
// import {
//   ActionFunctionArgs,
//   defer,
//   json,
//   LoaderFunctionArgs,
// } from '@remix-run/node';
// import { useFetcher, useLoaderData } from '@remix-run/react';
// import { Suspense, useEffect, useRef, useState } from 'react';
// import Post from '~/routes/_.feed/components/post';
// import {
//   BOTTOM_BAR_HEIGHT,
//   HEADER_HEIGHT,
//   INTENTS,
//   ITEMS_PER_PAGE,
// } from '~/lib/constants';
// import { getPosts } from '~/.server/queries';
// import { authenticator } from '~/services/auth.server';
// import {
//   comment,
//   commentUpdate,
//   deleteComment,
//   deletePost,
//   editPost,
//   post,
//   react,
// } from './actions';
// import { EmptyFeed, PostForm } from './components';
// import { authenticateOrToast } from '~/.server/utils';
// import AppIntro from './components/app-intro';
// import { FeedHeader } from './components/feed-header';
// import { FeedSkeleton } from './components/feed-skeleton';
// import { useTranslations } from 'use-intl';

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const url = new URL(request.url);
//   const page = parseInt(url.searchParams.get('page') ?? '1');
//   const { user, loginRedirect } = await authenticateOrToast(request);
//   if (!user) return loginRedirect;

//   const { count, data } = await getPosts({
//     page,
//     userID: user?.id,
//   });

//   return json({
//     posts: data,
//     totalPostsCount: count,
//     user,
//     page,
//   });
// };

// const Feed = () => {
//   const {
//     posts: initialPosts,
//     page,
//     totalPostsCount,
//     user,
//   } = useLoaderData<typeof loader>();
//   const t = useTranslations('feed');

//   const [postFormOpened, { close: postFormClose, open: postFormOpen }] =
//     useDisclosure();
//   const [introOpened, { close: introClose, toggle: introToggle }] =
//     useDisclosure();

//   const [posts, setPosts] = useState(initialPosts);
//   const [activePage, setActivePage] = useState<number>(page);
//   const [hasMore, setHasMore] = useState(
//     activePage < Math.ceil(totalPostsCount / ITEMS_PER_PAGE)
//   );
//   const fetcher = useFetcher();
//   const { inViewport, ref } = useInViewport();

//   const loadMorePosts = () => {
//     console.log('load more posts called ++++++++++++++++++++++++++++++=');
//     if (hasMore && fetcher.state === 'idle') {
//       fetcher.load(`/feed?page=${activePage + 1}`);
//     }
//   };

//   // const handleScroll = () => {
//   //   console.log(
//   //     'handleScroll called ============================================'
//   //   );
//   //   if (inViewport && hasMore) {
//   //     loadMorePosts();
//   //   }
//   // };

//   useEffect(() => {
//     if (inViewport) {
//       console.log({ ref, inViewport });
//       if (hasMore) {
//         loadMorePosts();
//       }
//     }
//   }, [inViewport]);

//   useEffect(() => {
//     if (fetcher.data && fetcher.data.posts) {
//       setPosts((prev) => [...prev, ...fetcher.data?.posts]);
//       setActivePage(fetcher.data.page);
//       setHasMore(
//         fetcher.data.page < Math.ceil(totalPostsCount / ITEMS_PER_PAGE)
//       );
//     }
//   }, [fetcher]);

//   console.log({
//     posts,
//     inViewport,
//   });

//   return (
//     <>
//       <Stack
//         py='xs'
//         style={{
//           height: `calc(100vh - ${HEADER_HEIGHT}px - ${BOTTOM_BAR_HEIGHT}px)`,
//           overflow: 'hidden',
//         }}
//         gap={0}
//       >
//         <FeedHeader
//           introOpened={introOpened}
//           postFormOpen={postFormOpen}
//           toggleIntro={introToggle}
//         />
//         <AppIntro opened={introOpened} close={introClose} />
//         {/* <Suspense fallback={<FeedSkeleton />}>
//           <Await resolve={posts}>
//             {(posts) => {
//               return (
//                 <> */}
//         {/* current page is {activePage} */}
//         <ScrollArea
//           styles={{
//             thumb: {
//               backgroundColor: 'transparent',
//             },
//           }}
//         >
//           <SimpleGrid
//             py='md'
//             cols={{ base: 1 }}
//             mb='md'
//             hidden={totalPostsCount === 0}
//           >
//             <Post post={posts[0]} userID={user.id} />
//             {/* {posts.map((post, idx) => (
//               <Box key={`${post.id}-${idx}`}>
//                 <Post post={post} userID={user.id} />
//               </Box>
//             ))} */}
//           </SimpleGrid>
//           {/* {posts.map((_, idx) => (
//             <div
//               key={_.id}
//               style={{
//                 height: '50vh',
//                 backgroundColor: 'green',
//                 margin: '2rem',
//               }}
//             >
//               hi
//             </div>
//           ))} */}
//           <Text ref={ref}>loading more...</Text>
//           <EmptyFeed hidden={totalPostsCount > 0} open={postFormOpen} />
//         </ScrollArea>
//         {/* </>
//               );
//             }}
//           </Await>
//         </Suspense> */}
//       </Stack>

//       {/* ++++++++++++++++++++++++++++++++++++++++++++++ */}
//       {/* Modals and Drawers */}

//       {/* post form */}
//       <Modal
//         title={t('create_new_post')}
//         opened={postFormOpened}
//         onClose={postFormClose}
//         styles={{
//           content: {
//             overflow: 'hidden',
//           },
//         }}
//       >
//         <ScrollArea.Autosize mah='70vh' offsetScrollbars>
//           <PostForm close={postFormClose} />
//         </ScrollArea.Autosize>
//       </Modal>

//       {/* filters */}
//       {/* <Drawer
//         opened={opened}
//         onClose={close}
//         position='bottom'
//         title={t('filter_content')}
//         hiddenFrom='sm'
//         size='lg'
//       >
//         <FeedFilters />
//       </Drawer>
//       <Modal size='lg' opened={opened} onClose={close} visibleFrom='sm'>
//         <FeedFilters />
//       </Modal> */}
//       {/* <ScrollToTop /> */}
//     </>
//   );
// };

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const formData = await request.formData();
//   const user = await authenticator.isAuthenticated(request);
//   const userID = Number(user?.id);
//   const intent = String(formData.get('intent'));

//   switch (intent) {
//     case INTENTS.react:
//       return await react(formData, userID);
//     case INTENTS.comment:
//       return await comment(formData, userID);
//     case INTENTS.updateComment:
//       return await commentUpdate(formData);
//     case INTENTS.deleteComment:
//       return await deleteComment(formData);
//     case INTENTS.post:
//       return await post(formData, userID);
//     case INTENTS.editPost:
//       return await editPost(formData);
//     case INTENTS.deletePost:
//       return await deletePost(formData, request);
//   }
// };

// export default Feed;

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
        gap={0}
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
                      py='md'
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
        <ScrollArea.Autosize mah='70vh' offsetScrollbars>
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
