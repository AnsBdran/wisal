import { useForm } from '@conform-to/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ActionIcon, Chip, Stack, Textarea, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Form, useActionData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { icons } from '~/lib/icons';
import { SuggestionEditSchema } from '~/lib/schemas';
import { Suggestion } from '~/lib/types';
import { action } from '~/routes/dashboard.suggestions';
export const IsAcceptedChip = ({ defaultValue }: { defaultValue: boolean }) => {
  const { t } = useTranslation('dashboard');
  return (
    <>
      <Chip checked={defaultValue} color='green'>
        {defaultValue ? t('accepted') : t('not_accepted')}
      </Chip>
    </>
  );
};

export const SuggestionActions = ({ row }: { row: Suggestion }) => {
  const lastResult = useActionData<typeof action>();
  const [form, { title, isAccepted, description, choices }] = useForm<
    z.infer<SuggestionEditSchema>
  >({ lastResult, defaultValue: row });
  return (
    <>
      <ActionIcon.Group variant='outline'>
        <ActionIcon variant='outline' color='red'>
          <Icon icon={icons.delete} />
        </ActionIcon>
        <ActionIcon
          variant='outline'
          onClick={() =>
            modals.open({
              children: (
                <>
                  <>
                    <Form method='POST' onSubmit={form.onSubmit} id={form.id}>
                      <Stack>
                        <TextInput name={title.name} error={title.errors} />
                        <Textarea
                          name={description.name}
                          error={description.errors}
                        />
                      </Stack>
                    </Form>
                  </>
                </>
              ),
              overlayProps: {
                blur: 4,
                backgroundOpacity: 0.2,
              },
            })
          }
        >
          <Icon icon={icons.edit} />
        </ActionIcon>
      </ActionIcon.Group>
    </>
  );
};
