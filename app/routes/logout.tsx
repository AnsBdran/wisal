import { ActionFunction } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const action: ActionFunction = async ({ request }) => {
  console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  console.log('are you trying to sign out?');
  console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  return authenticator.logout(request, {
    redirectTo: '/login',
  });
};
