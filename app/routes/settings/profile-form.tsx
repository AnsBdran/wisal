import { Icon } from '@iconify/react';
import { Button, Group, Stack, Textarea, TextInput } from '@mantine/core';
import { Form, useActionData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { icons } from '~/lib/icons';
import { User } from '~/lib/types';
import { action } from './route';
import { useForm } from '@conform-to/react';
import { z } from 'zod';
import { profileSchema } from '~/lib/schemas';
import { INTENTS } from '~/lib/constants';

export const ProfileForm = ({ user }: { user: User }) => {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.infer<typeof profileSchema>>({
    lastResult,
    defaultValue: user,
    shouldRevalidate: 'onInput',
    shouldValidate: 'onInput',
  });
  console.log('form app', fields.username.errors);
  const { t } = useTranslation(['form', 'settings']);
  return (
    <Form method='post' onSubmit={form.onSubmit} noValidate id={form.id}>
      <Stack>
        <Group align='flex-start'>
          <TextInput
            name={fields.firstName.name}
            defaultValue={fields.firstName.initialValue}
            key={fields.firstName.key}
            label={t('first_name')}
            flex={1}
            error={t(fields.firstName.errors ?? '')}
          />
          <TextInput
            defaultValue={fields.middleName.initialValue}
            name={fields.middleName.name}
            key={fields.middleName.key}
            label={t('middle_name')}
            error={t(fields.middleName.errors ?? '')}
            flex={1}
          />
          <TextInput
            defaultValue={fields.lastName.initialValue}
            name={fields.lastName.name}
            key={fields.lastName.key}
            label={t('last_name')}
            flex={1}
            error={t(fields.lastName.errors ?? '')}
          />{' '}
        </Group>
        <TextInput
          defaultValue={fields.username.initialValue}
          name={fields.username.name}
          key={fields.username.key}
          label={t('username')}
          error={t(fields.username.errors ?? '')}
          leftSection={<Icon icon={icons.profile} />}
        />
        <TextInput
          defaultValue={fields.email.initialValue}
          name={fields.email.name}
          key={fields.email.key}
          label={t('email')}
          leftSection={<Icon icon={icons.email} />}
          error={t(fields.email.errors ?? '')}
        />

        <Textarea name='bio' label={t('bio')} defaultValue={user?.bio ?? ''} />
        <TextInput
          defaultValue={fields.nickname.initialValue}
          name={fields.nickname.name}
          key={fields.nickname.key}
          label={t('nickname')}
          error={t(fields.nickname.errors ?? '')}
        />
      </Stack>
      <Button
        type='submit'
        variant='gradient'
        size='compact-xl'
        leftSection={<Icon icon={icons.checkMark} />}
        mt={'xl'}
        name='intent'
        value={INTENTS.editProfile}
      >
        {t('confirm')}
      </Button>
    </Form>
  );
};
