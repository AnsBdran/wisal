import { Box, Button, SegmentedControl, Stack, Title } from '@mantine/core';
import { Form, useActionData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { action } from '../route';
import { useForm } from '@conform-to/react';
import { z } from 'zod';
import { appSchema } from '~/lib/schemas';
import { INTENTS } from '~/lib/constants';

export const AppForm = ({
  defaultValue,
}: {
  defaultValue: { locale: 'ar' | 'en' };
}) => {
  const { t } = useTranslation(['settings']);
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.infer<typeof appSchema>>({
    lastResult,
  });
  return (
    <>
      <Form method='post' onSubmit={form.onSubmit} noValidate id={form.id}>
        <Box>
          <Stack>
            <Box>
              <Title order={3}>{t('choose_app_language')}</Title>
              <SegmentedControl
                fullWidth
                name={fields.locale.name}
                data={[
                  { label: 'English', value: 'en' },
                  { label: 'اللغة العربية', value: 'ar' },
                ]}
                defaultValue={defaultValue.locale}
              />
            </Box>
            {/* <Box>
            <Title order={3}>{t('posts_per_page')}</Title>
            <SegmentedControl
              fullWidth
              data={[
                { label: '8', value: 'eight' },
                { label: '12', value: 'twelve' },
                { label: '15', value: 'fifteen' },
              ]}
            />
          </Box> */}
            <Button
              type='submit'
              name='intent'
              size='compact-xl'
              value={INTENTS.editApp}
              variant='gradient'
              disabled={!form.dirty}
            >
              {t('confirm')}
            </Button>
          </Stack>
        </Box>
      </Form>
    </>
  );
};
