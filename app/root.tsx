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
import { LoaderFunctionArgs, SerializeFrom } from '@remix-run/node';
import { ModalsProvider } from '@mantine/modals';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';
import './font.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dropzone/styles.css';
import './tailwind.css';
import { ManifestLink, useSWEffect } from '@remix-pwa/sw';

// import { getUserLocale } from './.server/utils';
import i18next from './services/i18n.server';
import { authenticateOrToast, getUserLocale } from './.server/utils';
import { UserSessionContextProvider } from './lib/contexts/user-session';
import { useNetworkConnection } from './lib/hooks/use-network-connection';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const locale = await getUserLocale(request);
  const { toast, headers } = await getToast(request);
  const t = await i18next.getFixedT(locale, 'common');
  // const t = await i18next.getFixedT(locale, 'common');
  const title = t('app_title');
  const description = t('app_description');
  return json(
    {
      toast,
      locale,
      title,
      description,
    },
    { headers }
  );
};

export const meta: MetaFunction = ({ data }) =>
  // : {
  //   data: Awaited<SerializeFrom<typeof loader>>;
  // }
  {
    return [
      { title: data.title },
      { name: 'description', content: data.description },
    ];
  };

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
  // useChangeLanguage(locale);
  useSWEffect();
  useNetworkConnection();
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        {/* <ManifestLink /> */}
        <ManfiestIcons />
        <link rel='manifest' href='/manifest.webmanifest'></link>
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
              <UserSessionContextProvider>
                {children}
              </UserSessionContextProvider>
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Scripts />
      </body>
    </html>
  );
}

export const ManfiestIcons = () => (
  <>
    <link rel='apple-touch-icon' href='/icons/apple-icon-180.png' />

    <meta name='apple-mobile-web-app-capable' content='yes' />

    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2048-2732.jpg'
      media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2732-2048.jpg'
      media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1668-2388.jpg'
      media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2388-1668.jpg'
      media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1536-2048.jpg'
      media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2048-1536.jpg'
      media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1488-2266.jpg'
      media='(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2266-1488.jpg'
      media='(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1640-2360.jpg'
      media='(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2360-1640.jpg'
      media='(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1668-2224.jpg'
      media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2224-1668.jpg'
      media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1620-2160.jpg'
      media='(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2160-1620.jpg'
      media='(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1290-2796.jpg'
      media='(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2796-1290.jpg'
      media='(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1179-2556.jpg'
      media='(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2556-1179.jpg'
      media='(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1284-2778.jpg'
      media='(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2778-1284.jpg'
      media='(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1170-2532.jpg'
      media='(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2532-1170.jpg'
      media='(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1125-2436.jpg'
      media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2436-1125.jpg'
      media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1242-2688.jpg'
      media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2688-1242.jpg'
      media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-828-1792.jpg'
      media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1792-828.jpg'
      media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1242-2208.jpg'
      media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-2208-1242.jpg'
      media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-750-1334.jpg'
      media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1334-750.jpg'
      media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-640-1136.jpg'
      media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
    />
    <link
      rel='apple-touch-startup-image'
      href='/icons/apple-splash-1136-640.jpg'
      media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
    />
  </>
);

export default function App() {
  return <Outlet />;
}

export const ErrorBoundary = () => <NotFound />;
