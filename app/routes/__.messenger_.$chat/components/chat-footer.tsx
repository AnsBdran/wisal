import {
  ActionIcon,
  Box,
  Group,
  Input,
  rem,
  Image,
  Text,
  ScrollAreaAutosize,
  useMantineTheme,
} from '@mantine/core';
import styles from '../chat.module.css';
import { Icons } from '~/lib/icons';
import { useFetcher, useParams } from '@remix-run/react';
import { INTENTS, MESSENGER_FOOTER_HEIGHT } from '~/lib/constants';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useUpload } from '~/lib/hooks/useUpload';
import { useLocale, useTranslations } from 'use-intl';

export const ChatFooter = ({
  chatID,
  chatType,
}: {
  chatID: string;
  chatType: 'group' | 'direct';
}) => {
  const textFetcher = useFetcher();
  const imageFetcher = useFetcher();
  const locale = useLocale();
  const [content, setContent] = useState('');
  const { setFiles, uploadedData, isUploading, upload, files } = useUpload();
  const t = useTranslations('common');
  const openFileExplorerRef = useRef<() => void>(null);
  const params = useParams();
  const theme = useMantineTheme();

  const isGroup = chatType === 'group';
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

  const submitText = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    fd.append('contentType', 'text');
    fd.append('chatType', params.type!);
    fd.append('intent', INTENTS.sendMessage);
    textFetcher.submit(fd, {
      method: 'POST',
      action: `/messenger/${chatID}`,
    });
    setContent('');
  };

  const submitImages = () => {
    imageFetcher.submit(
      {
        intent: INTENTS.sendMessage,
        contentType: 'image',
        content: JSON.stringify(uploadedData.map((img) => img.secureURL!)),
        chatType: params.type!,
        chatID,
      },
      {
        method: 'POST',
      }
    );
  };

  useEffect(() => {
    if (!isUploading && uploadedData.length > 0) {
      submitImages();
    }
  }, [uploadedData, isUploading]);
  return (
    <Group
      h='100%'
      component='form'
      style={{ height: '100%' }}
      onSubmit={submitText}
      flex={1}
    >
      <Input
        className={`${styles.messageInput} ${
          isGroup ? styles.messageGroupInput : styles.messageDirectInput
        }`}
        flex={1}
        name='content'
        variant='filled'
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
      />
      <input type='hidden' name='chatID' value={chatID} />
      <ActionIcon
        type='submit'
        color={isGroup ? 'teal' : 'blue'}
        size='lg'
        disabled={!content}
        loading={textFetcher.state === 'submitting'}
      >
        <Icons.send className={locale === 'ar' ? 'rotate-180' : ''} />
      </ActionIcon>

      {/* upload images section */}
      <Dropzone.FullScreen
        active
        onDrop={setFiles}
        accept={IMAGE_MIME_TYPE}
        maxSize={3 * 1024 ** 2}
        openRef={openFileExplorerRef}
      >
        <Box
          style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Group style={{ pointerEvents: 'none' }} justify='center'>
            <Dropzone.Accept>
              <Icons.images
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)',
                }}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <Icons.cancel
                color='red'
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)',
                }}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Icons.images
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-dimmed)',
                }}
              />
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
        </Box>
      </Dropzone.FullScreen>
      {files.length > 0 ? (
        <ActionIcon.Group>
          <ActionIcon
            onClick={async () => {
              await upload();
              // submitImages();
            }}
            loading={isUploading}
            size='lg'
            // variant='filled'
            variant='filled'
            color={isGroup ? 'teal' : 'blue'}
          >
            <Icons.upload />
          </ActionIcon>
          <ActionIcon
            color='red'
            variant='filled'
            // mt='md'
            size='lg'
            onClick={() => setFiles([])}
          >
            <Icons.cancel />
          </ActionIcon>
        </ActionIcon.Group>
      ) : (
        <ActionIcon
          variant='outline'
          color={isGroup ? 'teal' : 'blue'}
          size='lg'
          onClick={() => openFileExplorerRef.current?.()}
        >
          <Icons.images />
        </ActionIcon>
      )}

      {/* previews box */}
      <Box
        className={styles.previewsContainer}
        bottom={MESSENGER_FOOTER_HEIGHT}
        hidden={files.length === 0}
      >
        <ScrollAreaAutosize mah={500} offsetScrollbars>
          <Group>{previews}</Group>
          {/* <Button fullWidth mt={'md'} color='red' onClick={() => setFiles([])}>
            {t('cancel')}
          </Button> */}
        </ScrollAreaAutosize>
      </Box>
    </Group>
  );
};
