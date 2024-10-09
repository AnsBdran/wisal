import {
  ActionIcon,
  Box,
  Drawer,
  Group,
  Modal,
  Pagination,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Post from '~/routes/_.feed/components/post';
import { INTENTS, ITEMS_PER_PAGE } from '~/lib/constants';
import { getPosts } from '~/.server/queries';
import { authenticator } from '~/services/auth.server';
import {
  comment,
  commentUpdate,
  deleteComment,
  editPost,
  post,
  react,
} from './actions';
import { FeedFilters } from './filters';
import { EmptyFeed, PostForm, ScrollToTop } from './components';
import { authenticateOrToast } from '~/.server/utils';
import { icons } from '~/lib/icons';
import { Icon } from '@iconify/react';
import AppIntro from './components/app-intro';
import { useUserSessionContext } from '~/lib/contexts/user-session';
import { EditPost } from './components/post/edit';
import { waiit } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  // await waiit(5000);
  const { user, loginRedirect } = await authenticateOrToast(request);
  if (!user) return loginRedirect;
  console.log('user in feed loader is', user);
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

export const handle = {
  i18n: ['common', 'feed', 'form'],
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
  const [
    introOpened,
    { open: introOpen, close: introClose, toggle: toggleIntro },
  ] = useDisclosure();
  // const [
  //   editPostFormOpened,
  //   { open: editPostFormOPen, close: editPostFormClose },
  // ] = useDisclosure();

  const [activePage, setActivePage] = useState<number>(
    page ? parseInt(page) : 1
  );

  // console.log('the user we are trying to set is', user);
  // const { setUserSession } = useUserSessionContext();
  // useEffect(() => {
  //   setUserSession(user);
  // }, [user, setUserSession]);

  return (
    <>
      <Stack hidden={posts.count === 0}>
        <Group justify='end'>
          <ActionIcon
            onClick={toggleIntro}
            variant={introOpened ? 'outline' : 'filled'}
          >
            <Icon icon={icons.info} />
          </ActionIcon>
          <ActionIcon onClick={postFormOpen}>
            <Icon icon={icons.add} />
          </ActionIcon>
        </Group>
        <AppIntro opened={introOpened} close={introClose} />
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {posts.data.map((post) => (
            <Box key={post.id}>
              <Post post={post} userID={user.id} />
              {/* post edit form */}
            </Box>
          ))}
        </SimpleGrid>
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
      <Modal
        title={t('create_new_post')}
        opened={postFormOpened}
        onClose={postFormClose}
      >
        <PostForm close={postFormClose} />
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
      <Modal size='lg' opened={opened} onClose={close} visibleFrom='sm'>
        <FeedFilters />
      </Modal>
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
  }
};

export default Feed;
