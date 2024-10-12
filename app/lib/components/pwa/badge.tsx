import { useRegisterSW } from 'virtual:pwa-register/react';

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  Group,
  Notification,
  Stack,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';

export const PWABadge = () => {
  const period = 60 * 60 * 1000;
  const { t } = useTranslation();

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = registerSW(period);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  //   if (offlineReady || needRefresh) {
  //     notifications.show({
  //       children: (
  //         <>
  //           <Box>
  //             {offlineReady ? (
  //               <Text>{t('now_works_offline')}</Text>
  //             ) : (
  //               <Text>{t('new_content_available')}</Text>
  //             )}
  //             {needRefresh && (
  //               <Button onClick={() => updateServiceWorker(true)}>
  //                 {t('reload')}
  //               </Button>
  //             )}
  //             <Button color='red' onClick={close}>
  //               {' '}
  //               {t('close')}
  //             </Button>
  //           </Box>
  //         </>
  //       ),
  //     });
  //   }

  //   if (offlineReady || needRefresh || true)
  //     return (
  //       <>
  //         <Notification>
  //           <Stack>
  //             {offlineReady ? (
  //               <Text>{t('now_works_offline')}</Text>
  //             ) : (
  //               <Text>{t('new_content_available')}</Text>
  //             )}
  //             <Group>
  //               {needRefresh && (
  //                 <Button onClick={() => updateServiceWorker(true)}>
  //                   {t('reload')}
  //                 </Button>
  //               )}
  //               <Button color='red' onClick={close}>
  //                 {' '}
  //                 {t('close')}
  //               </Button>
  //             </Group>
  //           </Stack>
  //         </Notification>
  //       </>
  //     );
  return (
    <>
      <Dialog
        opened={offlineReady || needRefresh}
        size='lg'
        radius='md'
        withCloseButton
        withBorder
      >
        <Stack>
          {offlineReady ? (
            <Text>{t('now_works_offline')}</Text>
          ) : (
            <Text>{t('new_content_available')}</Text>
          )}
          <Group>
            {needRefresh && (
              <Button onClick={() => updateServiceWorker(true)}>
                {t('reload')}
              </Button>
            )}
            <Button color='red' onClick={close}>
              {' '}
              {t('close')}
            </Button>
          </Group>
        </Stack>
      </Dialog>
    </>
  );
};

const registerPeriodicSync = (
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration
) => {
  if (period <= 0) return;
  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) {
      return;
    }

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    });

    if (resp.status === 200) {
      await r.update();
    }
  }, period);
};

const registerSW = (period: number): ReturnType<typeof useRegisterSW> => {
  if (typeof navigator === 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const offlineReady = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const needRefresh = useState(false);

    return {
      offlineReady,
      needRefresh,
      async updateServiceWorker() {},
    };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'activated') {
            registerPeriodicSync(period, swUrl, r);
          }
        });
      }
    },
  });
};
