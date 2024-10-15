import { Modal, Button, Stack, TextInput, Textarea } from '@mantine/core';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { useDisclosure } from '@mantine/hooks';
import {
  Form,
  useActionData,
  useFetcher,
  useNavigation,
} from '@remix-run/react';
import { useForm } from '@conform-to/react';
import { z } from 'zod';
import { SuggestionSchemaType } from '~/lib/schemas';
import { useTranslation } from 'react-i18next';
import { action } from './route';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { INTENTS } from '~/lib/constants';

export const SuggestionForm = () => {
  const [opened, { open, close }] = useDisclosure();
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<SuggestionSchemaType>({
    lastResult,
  });
  const { t } = useTranslation('suggestions');
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';
  useEffect(() => {
    if (!isLoading && lastResult?.success) {
      close();
      notifications.show({
        title: t('submitted_successfully'),
        message: t('submitted_successfully_description'),
      });
    }
  }, [lastResult, navigation.state]);
  return (
    <>
      <Button
        variant='outline'
        onClick={open}
        leftSection={<Icon icon={icons.add} />}
      >
        {t('submit_suggestion')}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        overlayProps={{
          blur: 3,
          backgroundOpacity: 0.4,
        }}
        title={t('submit_suggestion')}
      >
        <Form method='POST' onSubmit={form.onSubmit} id={form.id}>
          {/* <fetcher.Form method='POST' onSubmit={form.onSubmit} id={form.id}> */}
          <Stack>
            <TextInput
              name={fields.title.name}
              label={t('suggestion_title')}
              error={t(fields.title.errors ?? '')}
            />

            <Textarea
              name={fields.description.name}
              label={t('suggestion_description')}
              autosize
              error={t(fields.description.errors ?? '')}
            />
            <Button
              name='intent'
              value={INTENTS.submitSuggestion}
              type='submit'
              loading={navigation.state === 'submitting'}
              loaderProps={{ type: 'dots' }}
            >
              {t('submit')}
            </Button>
          </Stack>
        </Form>
        {/* </fetcher.Form> */}
      </Modal>
    </>
  );
};
