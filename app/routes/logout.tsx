import { ActionFunction } from '@remix-run/node';
import { redirectWithSuccess } from 'remix-toast';
import { destroySession, getSession } from '~/services/session.server';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const t = (t) => t;
  return redirectWithSuccess(
    '/login',
    {
      message: t('successfully_logged_out'),
      description: t('log_back_in'),
    },
    {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    }
  );
};
