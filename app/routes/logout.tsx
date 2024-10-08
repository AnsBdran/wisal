import { ActionFunction } from '@remix-run/node';
import i18next from '~/services/i18n.server';
import { redirectWithSuccess } from 'remix-toast';
import { destroySession, getSession } from '~/services/session.server';

export const action: ActionFunction = async ({ request }) => {
  const t = await i18next.getFixedT(request, 'common');
  const session = await getSession(request.headers.get('Cookie'));

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
