import { createCookie, createCookieSessionStorage } from '@remix-run/node';

type UserPrefs = {
  locale: 'ar' | 'en';
};
export const userPrefs = createCookieSessionStorage({
  cookie: {
    name: 'user-prefs',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  },
});
