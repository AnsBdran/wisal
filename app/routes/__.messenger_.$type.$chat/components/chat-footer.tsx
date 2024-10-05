import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  CopyButton,
  Drawer,
  Group,
  Input,
  Menu,
  rem,
  ScrollArea,
  Stack,
  Image,
  Text,
  TextInput,
  ScrollAreaAutosize,
} from '@mantine/core';
import styles from '../chat.module.css';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react/dist/iconify.js';
import { icons } from '~/lib/icons';
import { Link, useFetcher, useNavigate, useParams } from '@remix-run/react';
import { INTENTS, MESSENGER_FOOTER_HEIGHT } from '~/lib/constants';
import { act, FormEvent, useEffect, useRef, useState } from 'react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useUpload } from '~/lib/hooks/useUpload';

export const ChatFooter = ({ chatID }: { chatID: number }) => {
  const textFetcher = useFetcher();
  const imageFetcher = useFetcher();
  const { i18n } = useTranslation();
  const [content, setContent] = useState('');
  const { setFiles, uploadedData, isUploading, upload, files } = useUpload();
  const { t } = useTranslation();
  const openFileExplorerRef = useRef<() => void>(null);
  const params = useParams();

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
      action: `/messenger/${params.type}/${chatID}`,
    });
  };

  const submitImages = () => {
    imageFetcher.submit(
      {
        intent: INTENTS.sendMessage,
        contentType: 'image',
        content: JSON.stringify(uploadedData.map((img) => img.secureURL!)),
        chatType: params.type!,
        chatID,
      }
      // {
      //   method: 'POST',
      // }
    );
  };

  useEffect(() => {
    if (!isUploading && uploadedData.length > 0) {
      submitImages();
    }
  }, [uploadedData, isUploading]);
  return (
    <Group h='100%'>
      {/* <input type='hidden' name='chatType' value={} /> */}
      <Box
        component='form'
        // method='POST'
        style={{ height: '100%' }}
        onSubmit={submitText}
        flex={1}
      >
        <Group h={'100%'}>
          <input type='hidden' name='chatID' value={chatID} />
          <Input
            className={styles.messageInput}
            flex={1}
            name='content'
            value={content}
            onChange={(ev) => setContent(ev.target.value)}
          />
          <ActionIcon
            type='submit'
            variant='outline'
            size='lg'
            disabled={!content}
            loading={textFetcher.state === 'submitting'}
          >
            <Icon
              icon={icons.send}
              className={i18n.language === 'ar' ? 'rotate-180' : ''}
            />
          </ActionIcon>
        </Group>
      </Box>

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
              <Icon
                icon={icons.photos}
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)',
                }}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <Icon
                icon={icons.close}
                color='red'
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)',
                }}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Icon
                icon={icons.photos}
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
        <ActionIcon
          onClick={async () => {
            await upload();
            // submitImages();
          }}
          loading={isUploading}
          size='lg'
          variant='gradient'
        >
          <Icon icon={icons.upload} />
        </ActionIcon>
      ) : (
        <ActionIcon
          variant='outline'
          size='lg'
          onClick={() => openFileExplorerRef.current?.()}
        >
          <Icon icon={icons.photos} />
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
          <Button fullWidth mt={'md'} color='red' onClick={() => setFiles([])}>
            {t('cancel')}
          </Button>
        </ScrollAreaAutosize>
      </Box>
    </Group>
  );
};
