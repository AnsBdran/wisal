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

import { json, LoaderFunctionArgs } from '@remix-run/node';
import { theme } from './lib/theme';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import i18next from '~/services/i18n.server';
import { useChangeLanguage } from 'remix-i18next/react';
import { useTranslation } from 'react-i18next';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await i18next.getLocale(request);
  return json({
    locale,
  });
};

export const handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: 'common',
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
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
  // const { locale } = useLoaderData<typeof loader>();
  // useChangeLanguage(locale);
  return <Outlet />;
}
