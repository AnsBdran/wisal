import { Group, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { SuggestionForm } from './bits';
import { parseWithZod } from '@conform-to/zod';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import { suggestionSchema } from '~/lib/schemas';
import { db } from '~/.server/db';
import { suggestions, votes } from '../../.server/db/schema/review';
import { waiit } from '~/lib/utils';
import { getSuggestions } from '~/.server/queries';
import { useLoaderData } from '@remix-run/react';
import Suggestion from './suggestion';
import { authenticateOrToast } from '~/.server/utils';
import { INTENTS } from '~/lib/constants';
import { and, eq } from 'drizzle-orm';
import { authenticator } from '~/services/auth.server';
import styles from './suggestions.module.css';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { suggestions } = await getSuggestions();
  const { user, loginRedirect: redirect } = await authenticateOrToast(request);
  if (!user) return redirect;

  return json({ suggestions, user });
};

const Suggestions = () => {
  const { suggestions, user } = useLoaderData<typeof loader>();
  const { t } = useTranslation('suggestions');
  return (
    <>
      <Stack>
        <Group justify='space-between'>
          <Title>{t('suggestions')}</Title>
          <SuggestionForm />
        </Group>
        <Stack gap='xl' className={styles.suggestionsContainer}>
          {suggestions.map((s) => (
            <Suggestion key={s.id} suggestion={s} userID={user.id} />
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default Suggestions;

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log('suggestion action called');
  const user = await authenticator.isAuthenticated(request);
  console.log('the user in the action ', user);
  const userID = Number(user?.id);
  const fd = await request.formData();
  const intent = fd.get('intent');
  const suggestionID = Number(fd.get('suggestionID'));
  const choiceID = Number(fd.get('choiceID'));

  switch (intent) {
    case INTENTS.submitSuggestion: {
      await waiit();
      const submission = parseWithZod(fd, { schema: suggestionSchema });
      if (submission.status !== 'success') {
        console.log('submission failed');
        return submission.reply();
      }
      const { title, description } = submission.value;
      await db.insert(suggestions).values({
        title,
        description,
      });
      return json({ success: true });
    }
    case INTENTS.submitVote: {
      const existingVote = await db
        .select()
        .from(votes)
        .where(
          and(eq(votes.userID, userID), eq(votes.suggestionID, suggestionID))
        );
      if (existingVote.length > 0) {
        await db
          .update(votes)
          .set({ choiceID: choiceID })
          .where(eq(votes.id, existingVote[0].id));
      } else {
        await db.insert(votes).values({ choiceID, suggestionID, userID });
      }
      return { success: true };
    }
    case INTENTS.cancelVote: {
      await db
        .delete(votes)
        .where(
          and(eq(votes.userID, userID), eq(votes.suggestionID, suggestionID))
        );
      return { deleted: true };
    }
  }
};
