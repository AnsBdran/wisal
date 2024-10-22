import { parseWithZod } from '@conform-to/zod';
import { Title } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { eq, inArray } from 'drizzle-orm';
import { useTranslations } from 'use-intl';
import { db } from '~/.server/db';
import { choices, suggestions } from '~/.server/db/schema';
import Table from '~/lib/components/main/table';
import { SuggestionEdit } from '~/lib/components/suggestion-edit';
import { INTENTS } from '~/lib/constants';
import { useEditSuggestionContext } from '~/lib/contexts/edit-suggestion';
import { suggestionEditSchema } from '~/lib/schemas';
import { getSuggestionsColumns } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _suggestions = await db.query.suggestions.findMany({
    with: {
      choices: true,
    },
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });
  // const _suggestions = await db.select().from(suggestions);

  return { suggestions: _suggestions };
};

const Suggestions = () => {
  const t = useTranslations('dashboard');
  const { suggestions } = useLoaderData<typeof loader>();
  const { suggestionRow: editSuggestion, opened } = useEditSuggestionContext();
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
  const intent = fd.get('intent');
  const id = Number(fd.get('suggestionID'));

  switch (intent) {
    case INTENTS.editSuggestion: {
      const submission = parseWithZod(fd, { schema: suggestionEditSchema });
      // await waiit(3000);

      if (submission.status !== 'success') {
        console.log('++++++++++', submission.error);
        return submission.reply();
      }

      // extract the form data
      const {
        choices: _choices,
        description,
        title,
        choicesToDelete,
        id,
      } = submission.value;

      // insert the suggestion
      await db
        .update(suggestions)
        .set({
          title,
          description,
        })
        .where(eq(suggestions.id, id));

      // delete choices if there is to delete
      if (submission.value.choicesToDelete.length > 0) {
        await db.delete(choices).where(inArray(choices.id, choicesToDelete));
      }

      // create the new choices
      for (let i = 0; i < _choices.length; i++) {
        if (_choices[i].id) {
          db.update(choices).set({
            description: _choices[i].description,
            title: _choices[i].title,
          });
        } else {
          await db.insert(choices).values({ ..._choices[i], suggestionID: id });
        }
      }
      return { success: true };
    }
    case INTENTS.changeSuggestionStatus: {
      console.log('hello status');
      const status = fd.get('status') === 'true';

      await db
        .update(suggestions)
        .set({ isAccepted: status })
        .where(eq(suggestions.id, id));
      return { success: true };
    }
    case INTENTS.deleteSuggestion: {
      await db.delete(suggestions).where(eq(suggestions.id, id));
      return { success: true };
    }
  }

  return null;
};

export default Suggestions;
