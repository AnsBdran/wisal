import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from '@mantine/core';
import {
  json,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { cssVariablesResolver, theme } from './lib/theme';
import NotFound from '~/lib/components/main/not-found/index';
import { getToast } from 'remix-toast';
import { useEffect } from 'react';
import { notifications, Notifications } from '@mantine/notifications';
import { authenticator } from './services/auth.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { ModalsProvider } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import './font.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import './tailwind.css';
import { ManifestLink } from '@remix-pwa/sw';

import { getUserLocale } from './.server/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await getUserLocale(request);
  const { toast, headers } = await getToast(request);
  return json(
    {
      toast,
      locale,
    },
    { headers }
  );
};

// export const meta: MetaFunction = () => {
//   return [
//     { title: 'Wisal' },
//     { name: 'description', content: 'Welcome to Wisal' },
//   ];
// };

export function Layout({ children }: { children: React.ReactNode }) {
  const { toast, locale } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (toast) {
      notifications.show({
        title: toast.message,
        message: toast.description,
      });
    }
  }, [toast]);
  const { t } = useTranslation();
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <ManifestLink />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <DirectionProvider
          detectDirection
          initialDirection={locale === 'en' ? 'ltr' : 'rtl'}
        >
          <MantineProvider
            // defaultColorScheme='dark'
            theme={theme}
            cssVariablesResolver={cssVariablesResolver}
          >
            <Notifications />
            <ModalsProvider
              labels={{ cancel: t('cancel'), confirm: t('confirm') }}
            >
              {children}
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = () => <NotFound />;
