import { useForm } from '@conform-to/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Textarea,
  TextInput,
  Title,
  Divider,
  Button,
  Collapse,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';
import { z } from 'zod';
import { icons } from '~/lib/icons';
import {
  SuggestionChoiceSchemaType,
  SuggestionEditSchemaType,
} from '~/lib/schemas';
import { useEditSuggestionContext } from '../contexts/edit-suggestion';
import { INTENTS } from '../constants';
import { useTranslations } from 'use-intl';

export const SuggestionEdit = () => {
  const fetcher = useFetcher();
  const [form, { title, description, choices }] = useForm<
    z.infer<SuggestionEditSchemaType>
  >({
    lastResult: fetcher.state === 'idle' ? fetcher.data : null,
  });
  const t = useTranslations('suggestions');
  const {
    suggestionRow: row,
    // close,
    // opened,
    setSuggestionRow,
  } = useEditSuggestionContext();

  const [defaultChoices, setDefaultChoices] = useState<
    z.infer<SuggestionChoiceSchemaType>[]
  >(row!.choices as z.infer<SuggestionChoiceSchemaType>[]);
  const [choicesOpened, { toggle: choicesToggle }] = useDisclosure();
  const [choicesToDelete, setChoicesToDelete] = useState<number[]>([]);

  const addChoice = () => {
    setDefaultChoices((prev) => [...prev, { title: '', description: '' }]);
  };
  const removeChoice = (idx: number) => {
    if (defaultChoices[idx].id) {
      setChoicesToDelete((prev) => [...prev, defaultChoices[idx].id as number]);
    }

    setDefaultChoices((prev) => {
      const choices = prev.filter((choice, i) => {
        return i !== idx;
      });
      return choices;
    });
  };

  if (!row) return null;
  return (
    <Modal
      opened={!!row}
      // opened={opened && !!row}
      onClose={() => {
        setSuggestionRow(null);
        // close();
      }}
    >
      {/* {JSON.stringify({ editSuggestion: row, opened }, null, 2)} */}

      <fetcher.Form
        method='POST'
        onSubmit={form.onSubmit}
        id={form.id}
        action='/dashboard/suggestions'
      >
        <input
          type='hidden'
          name={'choicesToDelete'}
          value={JSON.stringify(choicesToDelete)}
        />
        <input type='hidden' name='id' value={row.id} />
        <Stack>
          <TextInput
            name={title.name}
            error={title.errors}
            label={t('title')}
            defaultValue={row.title}
          />
          <Textarea
            name={description.name}
            error={description.errors}
            defaultValue={row.description ?? ''}
            autosize
            label={t('description')}
          />
          <Box>
            <Divider size={'lg'} mt={'xl'} mb={'md'} />
            <Group justify='space-between'>
              <Button
                component={Title}
                order={4}
                onClick={choicesToggle}
                variant='transparent'
              >
                {choicesOpened ? t('choices') : t('show_choices')}
              </Button>
              <ActionIcon onClick={addChoice} hidden={!choicesOpened}>
                <Icon icon={icons.add} />
              </ActionIcon>
            </Group>
            <Collapse in={choicesOpened} transitionDuration={400}>
              <Divider my={'xl'} variant='dotted' />
              <Stack gap={'xl'} px={'xs'}>
                {defaultChoices.map((choice, idx) => {
                  // const choiceField = choices[idx].getFieldSet();
                  // {defaultChoices?.map((choice, idx) => {
                  return (
                    <Fragment key={idx}>
                      <input type='hidden' name='choiceID' value={choice.id} />
                      <Stack gap={'xs'}>
                        <Group justify='space-between'>
                          <Title order={5}>
                            {t('choice_number')} {idx + 1}
                          </Title>
                          <ActionIcon
                            variant='subtle'
                            color='red.7'
                            onClick={() => removeChoice(idx)}
                          >
                            <Icon icon={icons.delete} />
                          </ActionIcon>
                        </Group>
                        <TextInput
                          name={`choices[${idx}].title`}
                          defaultValue={choice.title}
                          label={t('title')}
                          // error={`choices[${idx}].title.errors`}
                          // error={choiceField}
                        />
                        <Textarea
                          name={`choices[${idx}].description`}
                          defaultValue={choice.description}
                          label={t('description')}
                          // error={`choices[${idx}].description.errors`}
                          autosize
                        />
                      </Stack>
                      <Divider variant='dashed' />
                    </Fragment>
                  );
                })}
              </Stack>
            </Collapse>
          </Box>
          <Button
            type='submit'
            loading={fetcher.state !== 'idle'}
            name='intent'
            value={INTENTS.editSuggestion}
          >
            {t('confirm')}
          </Button>
        </Stack>
      </fetcher.Form>
    </Modal>
  );
};
