import { Alert, Button, Stack } from '@mantine/core';
import { useTranslations } from 'use-intl';

export const EmptyFeed = ({
  hidden,
  open,
}: {
  hidden: boolean;
  open: () => void;
}) => {
  const t = useTranslations('feed');
  return (
    <>
      <Stack hidden={hidden} my='xl'>
        <Alert title={t('empty_feed')}>{t('empty_feed_description')}</Alert>
        <Button variant='gradient' size='lg' onClick={open}>
          {t('create_the_first_post')}
        </Button>
      </Stack>
    </>
  );
};
