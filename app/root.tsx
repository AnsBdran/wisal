import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import './font.css';
import './tailwind.css';
import {} from '@remix-pwa/';

import {
  DirectionProvider,
  MantineProvider,
  ColorSchemeScript,
  Dialog,
  Text,
  Button,
  Stack,
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
import { IntlProvider, useTranslations } from 'use-intl';
// import { PWABadge } from './lib/components/pwa/badge';
import { getMessages, resolveLocale } from './services/next-i18n';
import { sendSkipWaitingMessage, useSWEffect } from '@remix-pwa/sw';
import { usePWAManager } from '@remix-pwa/client';
import { useDisclosure } from '@mantine/hooks';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  const locale = await resolveLocale(request);
  // const title = t('app_title');
  // const description = t('app_description');

  return json(
    {
      toast,
      // title,
      // description,
      messages: await getMessages(locale),
      locale,
    },
    { headers }
  );
};
export const meta: MetaFunction = ({ data }) => {
  return [
    { title: 'وصال' },
    { name: 'description', content: 'تواصل وتراسل مع أصدقائك وأحبابك.' },
    // { title: data.title },
    // { name: 'description', content: data.description },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale, toast, messages } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (toast) {
      notifications.show({
        title: toast.message,
        message: toast.description,
      });
    }
  }, [toast]);

  return (
    <html lang={locale} dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme='light' />
      </head>
      <body>
        <IntlProvider locale={locale} messages={messages} timeZone='UTC'>
          <DirectionProvider
            detectDirection
            initialDirection={locale === 'en' ? 'ltr' : 'rtl'}
          >
            <MantineProvider
              theme={theme}
              cssVariablesResolver={cssVariablesResolver}
            >
              <Notifications />
              {children}
            </MantineProvider>
          </DirectionProvider>
        </IntlProvider>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { swUpdate } = usePWAManager();
  const t = useTranslations('common');
  const [isOpened, { close }] = useDisclosure(true);
  // if (  swUpdate.isUpdateAvailable   ) {
  //   .show({
  //     title: t('update_available'),
  //     message:
  //   })
  // }
  // const t = useTranslations();
  // useSWEffect();

  const UpdateDialog = () => {
    return (
      <Dialog
        withBorder
        opened={swUpdate.isUpdateAvailable && isOpened}
        onClose={close}
        withCloseButton
      >
        {/* <Dialog opened={swUpdate.isUpdateAvailable}> */}
        <Stack>
          <Text c='primary'>{t('update_available')}</Text>
          <Button
            onClick={() => {
              sendSkipWaitingMessage(swUpdate.newWorker!);
              window.location.reload();
            }}
          >
            {t('install_update')}
          </Button>
        </Stack>
      </Dialog>
    );
  };
  return (
    <ModalsProvider
      labels={{ confirm: t('common.confirm'), cancel: t('common.cancel') }}
    >
      <Outlet />
      <UpdateDialog />
    </ModalsProvider>
  );
}

export const ErrorBoundary = () => <NotFound />;
