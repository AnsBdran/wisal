import { Box, UnstyledButton, Modal, ScrollArea } from '@mantine/core';
import { Link, useFetcher, useNavigate } from '@remix-run/react';
import { loader as apiLoader } from '~/routes/api.data';
import { getProfileInfo, getProfileInfoText } from '~/lib/utils';
import { useTranslation } from 'react-i18next';
import { INTENTS } from '~/lib/constants';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
export const ChooseUserToMessage = ({
  children,
}: // userID,
{
  children: ReactNode;
  // userID: number;
}) => {
  const [opened, { open, close }] = useDisclosure();
  const usersFetcher = useFetcher<typeof apiLoader>();
  const chatFetcher = useFetcher();
  const { t } = useTranslation();

  return (
    <>
      <UnstyledButton
        onClick={() => {
          usersFetcher.load(`/api/data?intent=${INTENTS.fetchUsers}`);
          open();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        component='div'
      >
        {children}
      </UnstyledButton>
      {/* <LoadingOverlay visible={usersFetcher.state === 'loading'} /> */}
      <Modal
        opened={opened}
        onClose={close}
        styles={{
          content: {
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        title={t('choose_User_to_chat_with')}
      >
        <ScrollArea.Autosize flex={1} mah={500} offsetScrollbars>
          {usersFetcher.data?.users.map((u) => (
            <Box
              py={'xs'}
              key={u.id}
              style={{
                borderBottom: '.5px solid',
                borderColor: 'var(--mantine-color-dimmed)',
              }}
              onClick={() =>
                chatFetcher.submit(
                  {
                    intent: INTENTS.findOrCreateChat,
                    // formID: userID,
                    targetID: u.id,
                  },
                  {
                    method: 'POST',
                  }
                )
              }
            >
              {getProfileInfo(u)}
              {/* <Divider /> */}
            </Box>
          ))}
        </ScrollArea.Autosize>
      </Modal>
    </>
  );
};
