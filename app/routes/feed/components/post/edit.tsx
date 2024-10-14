import { useTranslation } from 'react-i18next';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/feed/route';
import { Button, TextInput, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { PostForm } from '../post-form';

export const EditPost = ({
  post,
  userID,
  editPostFormClose,
}: {
  post: SerializeFrom<typeof loader>['posts']['data'][0];
  userID: number;
  editPostFormClose: () => void;
}) => {
  const { t } = useTranslation();
  console.log('what we have here', post, post.id);
  return (
    <>
      <PostForm
        close={editPostFormClose}
        initialValues={{
          content: post.content,
          title: post.title,
          id: post.id,
          images: post.images.map((img) => ({ id: img.id, url: img.url })),
        }}
        isEditForm={true}
      />
    </>
  );
};
