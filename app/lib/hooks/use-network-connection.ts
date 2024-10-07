import { notifications } from '@mantine/notifications';
import { useNetworkConnectivity } from '@remix-pwa/client';
export const useNetworkConnection = () => {
  return useNetworkConnectivity({
    onOnline: () => {
      //   const id = 'network-connectivity';
      const title = 'تمت معاودة الإتصال بالإنترنت.';
      const message = 'يمكنك تصفح آخر ما تم نشره منذ إنقطاع الإنترنت لديك.';
      notifications.show({
        title,
        message,
      });
    },
    onOffline: () => {
      const title = 'تم فقدان الإتصال بالإنترنت.';
      const message =
        'يبدو أنك لم تعد متصلاً بشبكة الإنترنت، الرجاء معاودة الإتصال لتبقى على إطلاع بآخر التحديثات.';
      notifications.show({
        title,
        message,
      });
    },
  });
};
