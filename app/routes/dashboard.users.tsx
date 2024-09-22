import { Title } from '@mantine/core';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json, useLoaderData } from '@remix-run/react';
import { eq } from 'drizzle-orm';
import { useTranslation } from 'react-i18next';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import Table from '~/lib/components/main/table/index';
import { INTENTS } from '~/lib/constants';
import {
  EditUserContextProvider,
  useEditUserContext,
} from '~/lib/contexts/edit-user';
import { UserRole } from '~/lib/types';
import { getUsersColumns } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const usersRecords = await db.select().from(users);
  return json({ users: usersRecords });
};

const Users = () => {
  const { t } = useTranslation();
  const { users } = useLoaderData<typeof loader>();
  return (
    <>
      <Title>{t('users')}</Title>
      <EditUserContextProvider>
        <Table columns={getUsersColumns()} data={users} />
      </EditUserContextProvider>
    </>
  );
};

export default Users;

export const action = async ({ request }: ActionFunctionArgs) => {
  const fd = await request.formData();
  const intent = fd.get('intent');
  const userID = fd.get('userID');
  const role = fd.get('role') as UserRole;
  console.log('we are hit');
  console.log('we are trying to edit something');
  console.log('++++++++++++++++++++++++++++++');
  switch (intent) {
    case INTENTS.editUserRole: {
      console.log('we are trying to edit user role');
      console.log('++++++++++++++++++++++++++++++');
      await db.update(users).set({ role }).where(eq(users.id, userID));
      return json({ success: true });
    }
    case INTENTS.editUserIsFamily:
      console.log('we are trying to edit user fmaily');
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
