import { useState } from 'react';
import { ImageType } from '../types';
import { notifications } from '@mantine/notifications';
import { FileWithPath } from '@mantine/dropzone';
import { useTranslations } from 'use-intl';

export const useUpload = () => {
  const t = useTranslations('common');
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState<Partial<ImageType>[]>([]);
  const upload = async () => {
    const fd = new FormData();
    const url = 'https://api.cloudinary.com/v1_1/' + 'duqlybigo' + '/upload';
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fd.append('file', file);
      fd.append('folder', 'wisal');
      fd.append('upload_preset', 'o56rc5xv');

      try {
        const res = await fetch(url, {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        if (data.error) {
          throw new Error('Somee error happened while uploading.');
        }
        setUploadedData((prev) => [
          ...prev,
          {
            height: data.height,
            format: data.format,
            publicID: data.public_id,
            secureURL: data.secure_url,
            url: data.url,
            width: data.width,
          },
        ]);
      } catch (error) {
        notifications.show({
          title: t('error_while_uploading'),
          message: t('error_while_uploading_description'),
        });
      }
    }
    setFiles([]);
    setIsUploading(false);
  };

  return {
    setFiles,
    uploadedData,
    isUploading,
    upload,
    files,
    setUploadedData,
  };
};
