import { Stack, Alert, Button } from '@mantine/core';
import { ChooseUserToMessage } from './choose-user';
import { useTranslations } from 'use-intl';

export const EmptyMessenger = ({ hidden }: { hidden: boolean }) => {
  const t = useTranslations('common');
  return (
    <>
      <Stack hidden={hidden} my={'xl'}>
        <Alert title={t('empty_messenger')}>
          {t('empty_messenger_description')}
        </Alert>
        <ChooseUserToMessage>
          <Button variant='gradient' w='100%' size='lg'>
            {t('start_first_chat')}
          </Button>
        </ChooseUserToMessage>
        {/* 
          <Modal opened={opened && fetcher.data?.users} onClose={close}>
            {fetcher.data?.users.map((u) => (
              <Box key={u.id}>{getProfileInfoText(u)}</Box>
            ))}
          </Modal> */}
      </Stack>
    </>
  );
};
