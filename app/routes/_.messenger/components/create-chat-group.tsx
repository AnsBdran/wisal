import {
  ActionIcon,
  Stack,
  Button,
  Modal,
  TextInput,
  Textarea,
  InputLabel,
  InputError,
  ScrollArea,
} from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { Icons } from '~/lib/icons';
import { INTENTS } from '~/lib/constants';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import MultiSelect from '~/lib/components/common/users-multi-select';
import { useForm } from '@conform-to/react';
import { ChatGroupSchemaType } from '~/lib/schemas';
import { useTranslations } from 'use-intl';

export const CreateChatGroupButton = () => {
  const fetcher = useFetcher();
  const [opened, { close, open }] = useDisclosure();
  const t = useTranslations('form');
  const [chosenMembers, setChosenMembers] = useState<number[]>([]);
  const [form, { bio, members, name }] = useForm<ChatGroupSchemaType>({
    lastResult: fetcher.state === 'idle' ? fetcher.data : null,
  });
  console.log('users', chosenMembers);
  return (
    <>
      <ActionIcon color='indigo' onClick={open}>
        <Icons.users />
      </ActionIcon>

      <Modal
        opened={opened}
        onClose={close}
        title={t('create_chat_group')}
        styles={{
          content: {
            overflow: 'hidden',
          },
        }}
      >
        <ScrollArea.Autosize mah={600} offsetScrollbars>
          <fetcher.Form method='POST' onSubmit={form.onSubmit} id={form.id}>
            <Stack>
              <TextInput
                name={name.name}
                error={name.errors && t(name.errors[0])}
                label={t('group_name')}
              />
              <Textarea
                name={bio.name}
                error={bio.errors && t(bio.errors[0])}
                label={t('group_description')}
                autosize
              />
              <input
                type='hidden'
                name='members'
                value={JSON.stringify(chosenMembers)}
              />
              <Stack gap={0}>
                <InputLabel mb='2px'>{t('choose_group_members')}</InputLabel>
                <MultiSelect
                  value={chosenMembers}
                  setValue={setChosenMembers}
                />
                <InputError>{members.errors && t(members.errors)}</InputError>
              </Stack>
              <Button
                type='submit'
                name='intent'
                value={INTENTS.createChatGroup}
              >
                {t('create')}
              </Button>
            </Stack>
          </fetcher.Form>
        </ScrollArea.Autosize>
      </Modal>
    </>
  );
};
