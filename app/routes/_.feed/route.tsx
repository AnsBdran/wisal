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
import { FeedFilters } from './filters';
import { CreatePostForm, ScrollToTop } from './bits';
import { authenticateOrToast } from '~/.server/utils';
import { parseWithZod } from '@conform-to/zod';
import { postSchema } from '~/lib/schemas';
import { uploadImage } from '~/.server/cloudinary';
import { db } from '~/.server/db';
import { images, posts } from '~/.server/db/schema';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '1');
  const searchQueries = Object.fromEntries(url.searchParams);
  // try {
  // }

  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;
  console.log('in feed route loader', user);
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
  const [activePage, setActivePage] = useState<number>(
    page ? parseInt(page) : 1
  );

  return (
    <>
      <Stack>
        <Group justify='end'>
          <CreatePostForm />
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
      <ScrollToTop />
    </>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = await authenticator.isAuthenticated(request);
  const userID = Number(user?.id);
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
    case INTENTS.post: {
      // const uploadHandler: UploadHandler = composeUploadHandlers(
      //   async ({ name, data }) => {
      //     if (name !== 'images') {
      //       return undefined;
      //     }
      //     const uploadedImage = await uploadImage(data);
      //     return uploadedImage?.secure_url;
      //   },
      //   createMemoryUploadHandler()
      // );

      // const formData = await parseMultipartFormData(request, uploadHandler);
      // console.log('uploaded image', formData.get('images'));
      const submission = parseWithZod(formData, { schema: postSchema });
      if (submission.status !== 'success') {
        return submission.reply();
      }
      const post = await db
        .insert(posts)
        .values({
          content: 'asdf',
          title: 'asldkf',
          userID,
          // userID: 323
          // content: submission.value.content,
          // title: submission.value.title,
          // userID: user?.id,
        })
        .returning();

      for (let i = 0; i < submission.value.images.length; i++) {
        const result = await uploadImage(submission.value.images[i]);
        await db.insert(images).values({
          format: result.format,
          postID: post[0].id,
          publicID: result.public_id,
          secureURL: result.secure_url,
        });
      }
      console.log('we have go something', result);
      // for (let i = 0; i < submission.value.images.length; i++) {
      // }

      return null;
    }
  }

  // return null;
};

export default Feed;
