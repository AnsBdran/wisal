import {
  Avatar,
  Box,
  Drawer,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useTranslations } from 'use-intl';
import { ChatWithMembers } from '~/lib/types';
import { getFullName, getProfileInfoText } from '~/lib/utils';
export const ChatInfo = ({
  info,
  opened,
  onClose,
}: {
  opened: boolean;
  info: ChatWithMembers;
  onClose: () => void;
}) => {
  const t = useTranslations('messenger');
  return (
    <Drawer.Root
      // style={{ overflow: 'hidden' }}
      opened={opened}
      onClose={onClose}
      position='bottom'
      size='xl'
      removeScrollProps={{
        enabled: false,
        removeScrollBar: true,
      }}
    >
      <Drawer.Overlay />
      <Drawer.Content style={{ overflow: 'hidden' }} pb='xl'>
        <Drawer.Header>
          <Drawer.Title>{t('chat_info')}</Drawer.Title>
          <Drawer.CloseButton />
        </Drawer.Header>
        <Drawer.Body h='100%' pb='xl'>
          <Stack h='100%'>
            <Group>
              <Text c='dimmed'>اسم المجموعة</Text>
              <Title order={3}>{info.name}</Title>
            </Group>
            <Group>
              <Text c='dimmed'>وصف المجموعة</Text>
              <Title order={3} style={{ textWrap: 'wrap' }}>
                {info.bio}
              </Title>
            </Group>
            <Title order={3}>أعضاء المجموعة</Title>
            <ScrollArea style={{ flexGrow: 1, flexBasis: 500 }}>
              <Stack>
                {info.members.map((m) => (
                  // {info.chat.members.map((m) => (
                  <Box key={m.userID}>
                    <Group>
                      <Avatar
                        color='initials'
                        name={getFullName(m.user)}
                        radius='xs'
                      />
                      {getProfileInfoText(m.user)}
                    </Group>
                  </Box>
                ))}
              </Stack>
            </ScrollArea>
          </Stack>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};
