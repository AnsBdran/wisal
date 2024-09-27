import { parseWithZod } from '@conform-to/zod';
import { Title } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { eq, inArray } from 'drizzle-orm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { choices, suggestions } from '~/.server/db/schema';
import Table from '~/lib/components/main/table';
import { SuggestionEdit } from '~/lib/components/suggestion-edit';
import {
  EditSuggestionContextProvider,
  useEditSuggestionContext,
} from '~/lib/contexts/edit-suggestion';
import { suggestionEditSchema } from '~/lib/schemas';
import { Choice, Suggestion } from '~/lib/types';
import { getSuggestionsColumns, waiit } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _suggestions = await db.query.suggestions.findMany({
    with: {
      choices: true,
    },
  });
  // const _suggestions = await db.select().from(suggestions);

  return { suggestions: _suggestions };
};

const Suggestions = () => {
  const { t } = useTranslation('dashboard');
  const { suggestions } = useLoaderData<typeof loader>();
  const { editSuggestion, opened } = useEditSuggestionContext();
  return (
    <>
      <Title>{t('suggestions')}</Title>
      {JSON.stringify({ editSuggestion, opened }, null, 2)}
      <Table columns={getSuggestionsColumns()} data={suggestions} />
      {editSuggestion && <SuggestionEdit />}
    </>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // await waiit(3000);
  const fd = await request.formData();
  const submission = parseWithZod(fd, { schema: suggestionEditSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  // extract the form data
  const {
    choices: _choices,
    description,
    title,
    choicesToDelete,
  } = submission.value;
  // delete choices if there is to delete
  if (submission.value.choicesToDelete.length > 0) {
    await db.delete(choices).where(inArray(choices.id, choicesToDelete));
  }

  return null;
};

export default Suggestions;
