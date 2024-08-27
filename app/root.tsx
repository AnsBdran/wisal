import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from '@mantine/core';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import './tailwind.css';

import { authenticator } from '~/services/auth.server';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { theme } from './lib/theme';
import '@mantine/core/styles.css';
import i18nServer, { localeCookie } from '~/modules/i18n.server';
import { useChangeLanguage } from 'remix-i18next/react';
import { useTranslation } from 'react-i18next';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18nServer.getLocale(request);
  const user = await authenticator.isAuthenticated(request);
  return json({
    locale,
    user,
    headers: { 'Set-Cookie': await localeCookie.serialize(locale) },
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={locale ?? 'ar'} dir={i18n.dir()}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <DirectionProvider detectDirection>
          <MantineProvider defaultColorScheme='light' theme={theme}>
            {children}
          </MantineProvider>
        </DirectionProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  useChangeLanguage(locale);
  return <Outlet />;
}
