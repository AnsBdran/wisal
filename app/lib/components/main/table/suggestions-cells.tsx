import { useForm } from '@conform-to/react';
import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Chip,
  Group,
  List,
  Popover,
  Spoiler,
  Text,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { useFetcher } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { INTENTS } from '~/lib/constants';
import { useEditSuggestionContext } from '~/lib/contexts/edit-suggestion';
import { icons } from '~/lib/icons';
import { Suggestion, Choice } from '~/lib/types';

export const IsAcceptedChip = ({
  defaultValue,
  choicesCount,
  id,
}: {
  defaultValue: boolean;
  choicesCount: number;
  id: number;
}) => {
  const accepted = choicesCount > 2;
  const { t } = useTranslation('suggestions');
  const fetcher = useFetcher();
  return (
    <>
      <Chip
        checked={defaultValue}
        color='green'
        size='xs'
        onClick={() => {
          if (accepted) {
            modals.openConfirmModal({
              children: (
                <>
                  {!defaultValue && <Text>{t('accept_suggestion')}</Text>}
                  {defaultValue && <Text>{t('reject_suggestion')}</Text>}
                </>
              ),
              onConfirm: () => {
                fetcher.submit(
                  {
                    intent: INTENTS.changeSuggestionStatus,
                    suggestionID: id,
                    status: !defaultValue,
                  },
                  {
                    method: 'POST',
                  }
                );
              },
            });
          }
        }}
      >
        {defaultValue ? t('accepted') : t('rejected')}
      </Chip>
    </>
  );
};

export const SuggestionActions = ({
  row,
}: {
  row: Suggestion & { choices: Choice[] };
}) => {
  const {
    setSuggestionRow,
    // open
  } = useEditSuggestionContext();
  const { t } = useTranslation('suggestions');
  const fetcher = useFetcher();
  return (
    <>
      <ActionIcon.Group variant='outline'>
        <ActionIcon
          variant='outline'
          color='red'
          onClick={() => {
            modals.openConfirmModal({
              children: (
                <>
                  <Text>{t('delete_suggestion')}</Text>
                </>
              ),
              onConfirm: () => {
                fetcher.submit(
                  {
                    intent: INTENTS.deleteSuggestion,
                    suggestionID: row.id,
                  },
                  {
                    method: 'POST',
                  }
                );
              },
            });
          }}
        >
          <Icon icon={icons.delete} />
        </ActionIcon>
        <ActionIcon
          variant='outline'
          onClick={() => {
            setSuggestionRow(row);
            // open();
          }}
        >
          <Icon icon={icons.edit} />
        </ActionIcon>
      </ActionIcon.Group>
    </>
  );
};

export const Description = ({ value }: { value: string }) => {
  const { t } = useTranslation();
  return (
    <Spoiler showLabel={t('show_more')} hideLabel={t('hide')} fz='xs'>
      {value}
    </Spoiler>
  );
};

export const SuggestionChoices = ({ choices }: { choices: Choice[] }) => {
  console.log('choices in cell', choices);
  const { t } = useTranslation('suggestions');
  const { length } = choices;
  return (
    <>
      <Popover>
        <Popover.Target>
          <Text
            style={{ textWrap: 'nowrap' }}
            c={length > 0 ? 'blue' : 'dimmed'}
          >
            {t('choices_count', { count: length })}{' '}
          </Text>
        </Popover.Target>
        <Popover.Dropdown>
          <List>
            {choices.map((c) => (
              <List.Item key={c.id}>{c.title}</List.Item>
            ))}
          </List>
        </Popover.Dropdown>
      </Popover>
    </>
  );
};
