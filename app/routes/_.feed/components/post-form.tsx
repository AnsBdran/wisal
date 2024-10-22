import {
  ActionIcon,
  Box,
  Button,
  Group,
  Image,
  Text,
  Stack,
  Textarea,
  TextInput,
  useMantineTheme,
  Indicator,
} from '@mantine/core';
import { Icons } from '~/lib/icons';
import { useForm } from '@conform-to/react';
import { useFetcher } from '@remix-run/react';
import { action } from '../route';
import { INTENTS } from '~/lib/constants';
import { PostSchemaType } from '~/lib/schemas';
import { startTransition, useEffect, useState } from 'react';
import styles from '../feed.module.css';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useUpload } from '~/lib/hooks/useUpload';
import { useTranslations } from 'use-intl';

export const PostForm = ({
  close,
  initialValues,
  isEditForm,
}: {
  initialValues?: {
    title: string;
    content: string;
    id: number;
    images: { id: number; url: string }[];
  };
  isEditForm?: boolean;
  close: () => void;
}) => {
  const fetcher = useFetcher<typeof action>();
  const theme = useMantineTheme();
  const t = useTranslations('feed');
  const [form, fields] = useForm<PostSchemaType>({
    lastResult: fetcher.state === 'idle' ? fetcher.data : null,
    defaultValue: initialValues ? initialValues : null,
  });

  // if the post is to be deleted
  const [initialImages, setInitialImages] = useState<
    { id: number; url: string }[]
  >(initialValues?.images ?? []);

  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  console.log('initial values', initialValues);
  const { setFiles, isUploading, upload, uploadedData, files } = useUpload();

  useEffect(() => {
    startTransition(() => {
      if (fetcher.data?.success) {
        close();
      }
    });
  }, [fetcher.data]);

  const previews = files.map((file, idx) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Box key={idx} className={styles.preview}>
        <Image
          src={imageUrl}
          alt={file.name}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </Box>
    );
  });
  console.log('the files', files);

  const uploadedPreviews = uploadedData.map((image, idx) => {
    return (
      <Indicator key={idx} color='green'>
        <Box className={styles.preview}>
          <Image src={image.url} alt={`uploaded image`} />
        </Box>
      </Indicator>
    );
  });

  const initialImagesPreviews = initialImages.map((img, idx) => (
    <Box key={idx} className={styles.preview} pos='relative'>
      <Image src={img.url} alt='Uploaded Image' />
      <ActionIcon
        onClick={() => {
          setImagesToDelete((prev) => [...prev, img.id]);
          setInitialImages((prev) =>
            prev.filter((image) => image.id !== img.id)
          );
        }}
        size='xs'
        className={styles.imageDeleteBtn}
        color='red'
      >
        <Icons.cancel />
      </ActionIcon>
    </Box>
  ));

  return (
    <Box
      component={fetcher.Form}
      method='post'
      encType='multipart/form-data'
      id={form.id}
      // h='100%'
      className={styles.formWrapper}
    >
      <Stack>
        <input
          type='hidden'
          name='images'
          value={JSON.stringify(uploadedData)}
        />
        <input
          type='hidden'
          name='intent'
          value={isEditForm ? INTENTS.editPost : INTENTS.post}
        />
        {isEditForm && (
          <>
            <input type='hidden' name='postID' value={initialValues?.id} />
            <input
              type='hidden'
              name='imagesToDelete'
              value={JSON.stringify(imagesToDelete)}
            />
          </>
        )}
        <TextInput
          label={t('post_title')}
          name={fields.title.name}
          error={fields.title.errors && t(fields.title.errors[0])}
          defaultValue={fields.title.initialValue}
        />
        <Textarea
          label={t('post_content')}
          name={fields.content.name}
          error={fields.content.errors && t(fields.content.errors[0])}
          defaultValue={fields.content.initialValue}
          autosize
        />

        <Dropzone
          onDrop={setFiles}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Group
            justify='center'
            gap={'xl'}
            mih={150}
            style={{ pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <Icons.upload
                color={theme.colors.blue[6]}
                className={styles.dropZoneIcon}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <Icons.cancel
                color={theme.colors.red[6]}
                className={styles.dropZoneIcon}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Icons.images className={`${styles.dropZoneIcon}`} />
            </Dropzone.Idle>
            <Box>
              <Text size='xl' inline>
                {t('drop_files_here')}
              </Text>
              <Text size='sm' c={'dimmed'} inline mt={7}>
                {t('drop_files_here_description')}
              </Text>
            </Box>
          </Group>
        </Dropzone>
        <Box>
          <Group hidden={initialImages.length === 0}>
            {initialImagesPreviews}
          </Group>
          <Group hidden={uploadedData.length === 0}>{uploadedPreviews}</Group>
          <Group hidden={files.length === 0} justify='center'>
            {previews}
          </Group>
        </Box>
        <Group>
          <Button
            flex={1}
            type='submit'
            disabled={isUploading || !!files.length}
            loading={fetcher.state !== 'idle'}
          >
            {isEditForm ? t('edit') : t('create')}
          </Button>
          <Group gap='xs'>
            <ActionIcon
              color='red'
              hidden={isEditForm || files.length === 0}
              onClick={() => setFiles([])}
              size='lg'
            >
              <Icons.cancel />
            </ActionIcon>
            <ActionIcon
              size={'lg'}
              disabled={files.length === 0}
              color='green'
              type='button'
              onClick={upload}
              loading={isUploading}
            >
              <Icons.upload />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Box>
  );
};
