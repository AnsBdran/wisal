import { Stack, Alert, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ChooseUserToMessage } from './choose-user';

export const EmptyMessenger = ({ hidden }: { hidden: boolean }) => {
  const { t } = useTranslation();
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
