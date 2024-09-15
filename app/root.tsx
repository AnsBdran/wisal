import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from '@mantine/core';
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { theme } from './lib/theme';
import NotFound from '~/lib/components/main/not-found/index';
import { getToast } from 'remix-toast';
import { useEffect } from 'react';
import { notifications, Notifications } from '@mantine/notifications';
import { authenticator } from './services/auth.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { ModalsProvider } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';

import './tailwind.css';
import './font.css';
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userSession = await authenticator.isAuthenticated(request);
  const { toast, headers } = await getToast(request);
  return json(
    {
      toast,
      user: userSession,
    },
    { headers }
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { toast, user } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast) {
      notifications.show({
        title: toast.message,
        message: toast.description,
      });
    }
  }, [toast]);
  const { t } = useTranslation();
  useChangeLanguage(user?.locale ?? 'ar');

  return (
    <html
      lang={user?.locale ?? 'ar'}
      dir={user?.locale ? (user.locale === 'ar' ? 'rtl' : 'ltr') : 'rtl'}
    >
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <DirectionProvider
          detectDirection
          initialDirection={user?.locale === 'en' ? 'ltr' : 'rtl'}
        >
          <MantineProvider defaultColorScheme='light' theme={theme}>
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
