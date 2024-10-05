import {
  ActionIcon,
  Affix,
  Alert,
  Box,
  Button,
  Group,
  Image,
  ScrollArea,
  Text,
  Stack,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  Transition,
  useMantineTheme,
  SimpleGrid,
  Indicator,
  rem,
} from '@mantine/core';
import { icons } from '~/lib/icons';
import { Icon } from '@iconify/react';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useForm } from '@conform-to/react';
import { Form, useActionData, useFetcher } from '@remix-run/react';
import { action } from '../route';
import { HEADER_HEIGHT, INTENTS } from '~/lib/constants';
import { z } from 'zod';
import { postSchema, PostSchemaType } from '~/lib/schemas';
import { useEffect, useState } from 'react';
import { useObjectUrls } from '~/lib/hooks/useObjectUrls';
import styles from '../feed.module.css';
import type { ImageType } from '~/lib/types';
import {
  Dropzone,
  IMAGE_MIME_TYPE,
  DropzoneProps,
  FileWithPath,
} from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { useUpload } from '~/lib/hooks/useUpload';

export const PostForm = ({ close }: { close: () => void }) => {
  const fetcher = useFetcher<typeof action>();
  const theme = useMantineTheme();
  const { t } = useTranslation('feed');
  const [form, fields] = useForm<PostSchemaType>({
    lastResult: fetcher.state === 'idle' ? fetcher.data : null,
  });

  const { setFiles, isUploading, upload, uploadedData, files } = useUpload();

  useEffect(() => {
    if (fetcher.data?.success) {
      close();
    }
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

  const uploadedPreviews = uploadedData.map((image, idx) => {
    return (
      <Indicator key={idx} color='green' autoContrast>
        <Box className={styles.preview}>
          <Image src={image.url} alt={`uploaded image`} />
        </Box>
      </Indicator>
    );
  });

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
        <TextInput
          label={t('post_title')}
          name={fields.title.name}
          error={t(fields.title.errors ?? '')}
        />
        <Textarea
          label={t('post_content')}
          name={fields.content.name}
          error={t(fields.content.errors ?? '')}
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
              <Icon
                icon={icons.upload}
                color={theme.colors.blue[6]}
                className={styles.dropZoneIcon}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <Icon
                icon={icons.close}
                color={theme.colors.red[6]}
                className={styles.dropZoneIcon}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <Icon icon={icons.photos} className={styles.dropZoneIcon} />
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
          <Group hidden={uploadedData.length === 0}>{uploadedPreviews}</Group>
          <Group hidden={files.length === 0}>{previews}</Group>
        </Box>
        <Group>
          <Button
            flex={1}
            type='submit'
            name='intent'
            value={INTENTS.post}
            disabled={isUploading || !!files.length}
            loading={fetcher.state !== 'idle'}
          >
            {t('create')}
          </Button>
          <ActionIcon
            size={'lg'}
            disabled={files.length === 0}
            color='green'
            type='button'
            onClick={upload}
            loading={isUploading}
          >
            <Icon icon={icons.upload} />
          </ActionIcon>
        </Group>
      </Stack>
    </Box>
  );
};
// import {
//   ActionIcon,
//   Affix,
//   Alert,
//   Box,
//   Button,
//   Group,
//   Image,
//   ScrollArea,
//   Text,
//   Stack,
//   Textarea,
//   TextInput,
//   Title,
//   Tooltip,
//   Transition,
//   useMantineTheme,
//   SimpleGrid,
//   Indicator,
//   rem,
// } from '@mantine/core';
// import { icons } from '~/lib/icons';
// import { Icon } from '@iconify/react';
// import { useDisclosure, useWindowScroll } from '@mantine/hooks';
// import { useTranslation } from 'react-i18next';
// import { useForm } from '@conform-to/react';
// import { Form, useActionData, useFetcher } from '@remix-run/react';
// import { action } from '../route';
// import { HEADER_HEIGHT, INTENTS } from '~/lib/constants';
// import { z } from 'zod';
// import { postSchema, PostSchemaType } from '~/lib/schemas';
// import { useEffect, useState } from 'react';
// import { useObjectUrls } from '~/lib/hooks/useObjectUrls';
// import styles from '../feed.module.css';
// import type { ImageType } from '~/lib/types';
// import {
//   Dropzone,
//   IMAGE_MIME_TYPE,
//   DropzoneProps,
//   FileWithPath,
// } from '@mantine/dropzone';
// import { notifications } from '@mantine/notifications';

// export const PostForm = ({ close }: { close: () => void }) => {
//   const fetcher = useFetcher<typeof action>();
//   const [files, setFiles] = useState<FileWithPath[]>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadedData, setUploadedData] = useState<Partial<ImageType>[]>([]);
//   const theme = useMantineTheme();
//   const { t } = useTranslation('feed');
//   const [form, fields] = useForm<PostSchemaType>({
//     lastResult: fetcher.state === 'idle' ? fetcher.data : null,
//   });

//   useEffect(() => {
//     if (fetcher.data?.success) {
//       close();
//     }
//   }, [fetcher.data]);

//   const previews = files.map((file, idx) => {
//     const imageUrl = URL.createObjectURL(file);
//     return (
//       <Box key={idx} className={styles.preview}>
//         <Image
//           src={imageUrl}
//           alt={file.name}
//           onLoad={() => URL.revokeObjectURL(imageUrl)}
//         />
//       </Box>
//     );
//   });

//   const uploadedPreviews = uploadedData.map((image, idx) => {
//     return (
//       <Indicator key={idx} color='green' autoContrast>
//         <Box className={styles.preview}>
//           <Image src={image.url} alt={`uploaded image`} />
//         </Box>
//       </Indicator>
//     );
//   });

//   return (
//     <Box
//       component={fetcher.Form}
//       method='post'
//       encType='multipart/form-data'
//       id={form.id}
//       // h='100%'
//       className={styles.formWrapper}
//     >
//       <Stack>
//         <input
//           type='hidden'
//           name='images'
//           value={JSON.stringify(uploadedData)}
//         />
//         <TextInput
//           label={t('post_title')}
//           name={fields.title.name}
//           error={t(fields.title.errors ?? '')}
//         />
//         <Textarea
//           label={t('post_content')}
//           name={fields.content.name}
//           error={t(fields.content.errors ?? '')}
//           autosize
//         />

//         <Dropzone
//           onDrop={setFiles}
//           maxSize={3 * 1024 ** 2}
//           accept={IMAGE_MIME_TYPE}
//         >
//           <Group
//             justify='center'
//             gap={'xl'}
//             mih={150}
//             style={{ pointerEvents: 'none' }}
//           >
//             <Dropzone.Accept>
//               <Icon
//                 icon={icons.upload}
//                 color={theme.colors.blue[6]}
//                 className={styles.dropZoneIcon}
//               />
//             </Dropzone.Accept>
//             <Dropzone.Reject>
//               <Icon
//                 icon={icons.close}
//                 color={theme.colors.red[6]}
//                 className={styles.dropZoneIcon}
//               />
//             </Dropzone.Reject>
//             <Dropzone.Idle>
//               <Icon icon={icons.photos} className={styles.dropZoneIcon} />
//             </Dropzone.Idle>
//             <Box>
//               <Text size='xl' inline>
//                 {t('drop_files_here')}
//               </Text>
//               <Text size='sm' c={'dimmed'} inline mt={7}>
//                 {t('drop_files_here_description')}
//               </Text>
//             </Box>
//           </Group>
//         </Dropzone>
//         <Box>
//           <Group hidden={uploadedData.length === 0}>{uploadedPreviews}</Group>
//           <Group hidden={files.length === 0}>{previews}</Group>
//         </Box>
//         <Group>
//           <Button
//             flex={1}
//             type='submit'
//             name='intent'
//             value={INTENTS.post}
//             disabled={isUploading || !!files.length}
//             loading={fetcher.state !== 'idle'}
//           >
//             {t('create')}
//           </Button>
//           <ActionIcon
//             size={'lg'}
//             disabled={files.length === 0}
//             color='green'
//             type='button'
//             onClick={async () => {
//               setIsUploading(true);
//               const fd = new FormData();
//               const url =
//                 'https://api.cloudinary.com/v1_1/' + 'duqlybigo' + '/upload';

//               for (let i = 0; i < files.length; i++) {
//                 const file = files[i];
//                 fd.append('file', file);
//                 fd.append('folder', 'wisal');
//                 fd.append('upload_preset', 'o56rc5xv');

//                 try {
//                   const res = await fetch(url, {
//                     method: 'POST',
//                     body: fd,
//                   });
//                   const data = await res.json();
//                   if (data.error) {
//                     throw new Error('Somee error happened while uploading.');
//                   }
//                   setUploadedData((prev) => [
//                     ...prev,
//                     {
//                       height: data.height,
//                       format: data.format,
//                       publicID: data.public_id,
//                       secureURL: data.secure_url,
//                       url: data.url,
//                       width: data.width,
//                     },
//                   ]);
//                 } catch (error) {
//                   notifications.show({
//                     title: t('error_while_uploading'),
//                     message: t('error_while_uploading_description'),
//                   });
//                 }
//               }
//               setFiles([]);
//               setIsUploading(false);
//             }}
//             loading={isUploading}
//           >
//             <Icon icon={icons.upload} />
//           </ActionIcon>
//         </Group>
//       </Stack>
//     </Box>
//   );
// };
