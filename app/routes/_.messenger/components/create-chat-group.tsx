import {
  ActionIcon,
  Stack,
  Button,
  Modal,
  TextInput,
  Textarea,
  InputLabel,
  InputError,
} from '@mantine/core';
import { Link, useFetcher, useNavigate } from '@remix-run/react';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { useTranslation } from 'react-i18next';
import { INTENTS } from '~/lib/constants';
import { useDisclosure, useFetch } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import MultiSelect from '~/lib/components/common/users-multi-select';
import { useForm } from '@conform-to/react';
import { ChatGroupSchemaType } from '~/lib/schemas';
export const CreateChatGroupButton = () => {
  const fetcher = useFetcher();
  const [opened, { close, open }] = useDisclosure();
  const { t } = useTranslation('form');
  const [choosenMembers, setChoosenMembers] = useState<number[]>([]);
  const [form, { bio, members, name }] = useForm<ChatGroupSchemaType>({
    lastResult: fetcher.state === 'idle' ? fetcher.data : null,
  });
  console.log('users', choosenMembers);
  return (
    <>
      <ActionIcon color='indigo' onClick={open}>
        <Icon icon={icons.usersGroup} />
      </ActionIcon>

      <Modal opened={opened} onClose={close}>
        <fetcher.Form method='POST' onSubmit={form.onSubmit} id={form.id}>
          <Stack>
            <TextInput
              name={name.name}
              error={t(name.errors ?? '')}
              label={t('group_name')}
            />
            <Textarea
              name={bio.name}
              error={t(bio.errors ?? '')}
              label={t('group_description')}
            />
            <input
              type='hidden'
              name='members'
              value={JSON.stringify(choosenMembers)}
            />
            <Stack gap={0}>
              <InputLabel mb='2px'>{t('choose_group_members')}</InputLabel>
              <MultiSelect
                value={choosenMembers}
                setValue={setChoosenMembers}
              />
              <InputError>{t(members.errors ?? '')}</InputError>
            </Stack>
            <Button type='submit' name='intent' value={INTENTS.createChatGroup}>
              {t('create')}
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
};
