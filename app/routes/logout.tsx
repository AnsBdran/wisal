import { ActionFunction } from '@remix-run/node';
import i18next from '~/services/i18n.server';
import { redirectWithSuccess } from 'remix-toast';
import { authenticator } from '~/services/auth.server';

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return null;
  const t = await i18next.getFixedT(user.locale, 'common', {
    lng: user.locale,
  });
  return await authenticator.logout(request, { redirectTo: '/login' });
  // return redirectWithSuccess('/login', {
  //   message: t('successfully_logged_out'),
  //   description: t('log_back_in'),
  // });
};
