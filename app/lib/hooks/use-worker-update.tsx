import { Title, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { usePWAManager } from '@remix-pwa/client';
import { sendSkipWaitingMessage } from '@remix-pwa/sw';

export const useWorkerUpdate = () => {
  const { swUpdate } = usePWAManager();
  if (swUpdate.isUpdateAvailable) {
    modals.openConfirmModal({
      children: (
        <>
          <Title order={3}>يتوفر تحديث جديد</Title>
          <Text c='dimmed'>هل تود تثبيت التحديث الآن؟</Text>
        </>
      ),
      onConfirm: () => {
        sendSkipWaitingMessage(swUpdate.newWorker!);
        window.location.reload();
      },
    });
  }
};
