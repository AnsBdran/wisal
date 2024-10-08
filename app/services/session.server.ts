import { createCookieSessionStorage } from '@remix-run/node';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['secret'],
    // secrets: ['3ccff8dc-12ac-464c-90f8-a87e234f34a9'],
    maxAge: 60 * 60 * 24 * 90,
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { commitSession, destroySession, getSession } = sessionStorage;
