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

import i18next from './services/i18n.server';
import { PWABadge } from './lib/components/pwa/badge';
import { PWAAssets } from './lib/components/pwa/assets';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  const t = await i18next.getFixedT(request, 'common');
  const title = t('app_title');
  const description = t('app_description');
  const locale = await i18next.getLocale(request);
  return json(
    {
      toast,
      title,
      description,
      locale,
    },
    { headers }
  );
};

// export const handle = {
//   i18n: 'common',
// };
export const meta: MetaFunction = ({ data }) => {
  return [
    { title: data.title },
    { name: 'description', content: data.description },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation();
  // const locale = i18n.language;
  const { toast, locale } = data;

  useChangeLanguage(locale);
  useEffect(() => {
    if (toast) {
      notifications.show({
        title: toast.message,
        message: toast.description,
      });
    }
  }, [toast]);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <PWAAssets />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <DirectionProvider detectDirection initialDirection={i18n.dir()}>
          <MantineProvider
            theme={theme}
            cssVariablesResolver={cssVariablesResolver}
          >
            <Notifications />
            <ModalsProvider
              labels={{ cancel: t('cancel'), confirm: t('confirm') }}
            >
              {children}
              <PWABadge />
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
