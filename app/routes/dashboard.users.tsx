import { Title } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { useTranslations } from 'use-intl';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import Table from '~/lib/components/main/table/index';
import { INTENTS } from '~/lib/constants';
import { UserRole } from '~/lib/types';
import { getUsersColumns } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const usersRecords = await db.select().from(users);
  return json({ users: usersRecords });
};

const Users = () => {
  const t = useTranslations('common');
  const { users } = useLoaderData<typeof loader>();
  return (
    <>
      <Title>{t('users')}</Title>
      <Table columns={getUsersColumns()} data={users} />
    </>
  );
};

export default Users;

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const intent = fd.get('intent');
  const userID = Number(fd.get('userID'));
  const role = fd.get('role') as UserRole;
  switch (intent) {
    case INTENTS.editUserRole: {
      await db.update(users).set({ role }).where(eq(users.id, userID));
      return json({ success: true });
    }
    case INTENTS.editUserIsFamily:
      {
        await db
          .update(users)
          .set({ isFamily: fd.get('isFamily') === 'true' })
          .where(eq(users.id, userID));
      }
      return json({ success: true });
  }

  return null;
};
