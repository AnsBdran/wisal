import {
  Avatar,
  Text,
  Button,
  Paper,
  Group,
  Popover,
  FileButton,
  Image,
  Stack,
  SimpleGrid,
} from '@mantine/core';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { useTranslations } from 'use-intl';
import { authenticateOrToast } from '~/.server/utils';
import { INTENTS } from '~/lib/constants';
import { useUpload } from '~/lib/hooks/useUpload';
import { getFullName } from '~/lib/utils';
import { changeProfileImage } from './actions';
import { authenticator } from '~/services/auth.server';
import { getTranslations } from '~/services/next-i18n';
import { setupRoutes } from '~/sw/shared';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { loginRedirect, user } = await authenticateOrToast(request);
  if (!user) return loginRedirect;

  return json({ user });
};

const Profile = () => {
  const { user } = useLoaderData<typeof loader>();
  const t = useTranslations('common');
  const {
    setFiles,
    files,
    isUploading,
    upload,
    uploadedData,
    setUploadedData,
  } = useUpload();
  const fetcher = useFetcher();
  const ImagePreview = () => {
    if (files.length === 0) return;
    const url = URL.createObjectURL(files[0]);
    return (
      <Stack mt='md'>
        <Group grow>
          <Button
            color='green'
            size='compact-md'
            onClick={upload}
            loading={isUploading}
          >
            {t('confirm')}
          </Button>
          <Button
            onClick={() => setFiles([])}
            size='compact-md'
            color='red'
            variant='light'
          >
            {t('cancel')}
          </Button>
        </Group>

        <Image mah={400} src={url} onLoad={() => URL.revokeObjectURL(url)} />
      </Stack>
    );
  };

  const submitImage = () => {
    fetcher.submit(
      {
        intent: INTENTS.changeProfileImage,
        url: uploadedData[0].secureURL as string,
      },
      {
        method: 'POST',
      }
    );
  };

  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      submitImage();
      setUploadedData([]);
    }
  }, [uploadedData]);
  return (
    <Paper radius='md' withBorder p='lg' bg='var(--mantine-color-body)'>
      <Avatar
        src={user.profileImage}
        size={120}
        radius='md'
        color='initials'
        mx='auto'
        name={getFullName(user)}
      />
      <Text ta='center' fz='lg' fw={500} mt='md'>
        {getFullName(user)}
      </Text>
      <Text ta='center' c='dimmed' fz='sm'>
        {user.bio}
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt='md'>
        <Button variant='filled' component={Link} to='/settings'>
          {t('edit_profile')}
        </Button>
        <FileButton onChange={(f) => setFiles([f])}>
          {(props) => (
            <Button variant='outline' {...props}>
              {t('change_profile_image')}
            </Button>
          )}
        </FileButton>
      </SimpleGrid>
      <ImagePreview />
    </Paper>
  );
};

export default Profile;

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const user = await authenticator.isAuthenticated(request);
  const userID = Number(user?.id);
  const intent = fd.get('intent');
  switch (intent) {
    case INTENTS.changeProfileImage:
      return changeProfileImage(fd, userID, request);
  }
  return null;
};
