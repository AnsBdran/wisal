import { eq } from 'drizzle-orm';
import { jsonWithSuccess } from 'remix-toast';
import { db } from '~/.server/db';
import { users } from '~/.server/db/schema';
import { updateUserSession } from '~/.server/utils';
import { getTranslations } from '~/services/next-i18n';
import { commitSession, getSession } from '~/services/session.server';

export const changeProfileImage = async (
  fd: FormData,
  userID: number,
  request: Request
) => {
  const url = fd.get('url') as string;
  console.log('you have reached your target', url);
  const t = await getTranslations(request);

  const user = (
    await db
      .update(users)
      .set({ profileImage: url })
      .where(eq(users.id, userID))
      .returning()
  )[0];
  // const session = await getSession(request.headers.get('Cookie'));
  // session.set()
  const session = await updateUserSession(request, user);

  return jsonWithSuccess(
    { success: true },
    {
      message: t('common.updated_successfully'),
      description: t('common.profile_image_changed'),
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
