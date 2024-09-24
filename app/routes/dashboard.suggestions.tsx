import { parseWithZod } from '@conform-to/zod';
import { Title } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { suggestions } from '~/.server/db/schema';
import Table from '~/lib/components/main/table';
import { suggestionEditSchema } from '~/lib/schemas';
import { getSuggestionsColumns } from '~/lib/utils';
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const _suggestions = await db.select().from(suggestions);

  return { suggestions: _suggestions };
};

const Suggestions = () => {
  const { t } = useTranslation('dashboard');
  const { suggestions } = useLoaderData<typeof loader>();
  return (
    <>
      <Title>{t('suggestions')}</Title>
      <Table columns={getSuggestionsColumns()} data={suggestions} />
    </>
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const submission = parseWithZod(fd, { schema: suggestionEditSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }
  return null;
};

export default Suggestions;
