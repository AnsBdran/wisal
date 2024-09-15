import { Box, Button, SegmentedControl, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const AppForm = ({ user }) => {
  const { t } = useTranslation(['settings']);
  return (
    <>
      <Box>
        <Stack>
          <Box>
            <Title order={3}>{t('choose_app_language')}</Title>
            <SegmentedControl
              fullWidth
              defaultValue={user.locale}
              data={[
                { label: 'English', value: 'en' },
                { label: 'اللغة العربية', value: 'ar' },
              ]}
            />
          </Box>
          <Box>
            <Title order={3}>{t('posts_per_page')}</Title>
            <SegmentedControl
              fullWidth
              data={[
                { label: '8', value: '8' },
                { label: '12', value: '12' },
                { label: '15', value: '15' },
              ]}
            />
          </Box>
          <Button>{t('confirm')}</Button>
        </Stack>
      </Box>
    </>
  );
};

export default AppForm;
