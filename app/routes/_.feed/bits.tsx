import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Drawer,
  FileInput,
  Stack,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  Transition,
} from '@mantine/core';
import { icons } from '~/lib/icons';
import { Icon } from '@iconify/react';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useForm } from '@conform-to/react';
import { Form, useActionData } from '@remix-run/react';
import { action } from './route';
import { INTENTS } from '~/lib/constants';
import { z } from 'zod';
import { postSchema } from '~/lib/schemas';

export const ScrollToTop = () => {
  const [scroll, scrollTo] = useWindowScroll();
  const { t } = useTranslation();
  return (
    <Affix position={{ bottom: 60, right: 10 }}>
      <Transition transition='slide-up' mounted={scroll.y > 120}>
        {(transitionStyles) => (
          // <Tooltip label={t('scroll_to_top')}>
          <ActionIcon
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
            variant='light'
          >
            <Icon icon={icons.arrowUp} />
          </ActionIcon>
          // </Tooltip>
        )}
      </Transition>
    </Affix>
  );
};

export const CreatePostForm = () => {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm<z.infer<typeof postSchema>>({ lastResult });

  const [opened, { open, close }] = useDisclosure();
  const { t } = useTranslation('feed');

  return (
    <>
      <ActionIcon onClick={open}>
        <Icon icon={icons.add} />
      </ActionIcon>

      <Drawer.Root position='top' opened={opened} onClose={close}>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{t('create_new_post')}</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <Form method='post' encType='multipart/form-data' id={form.id}>
              <Stack>
                <TextInput
                  label={t('post_title')}
                  name={fields.title.name}
                  error={fields.title.errors}
                />
                <Textarea
                  label={t('post_content')}
                  name={fields.content.name}
                  error={fields.content.errors}
                  autosize
                />
                <FileInput
                  name={fields.images.name}
                  multiple
                  label={t('add_images')}
                  error={fields.images.errors}
                  placeholder={t('click_here_to_add_images')}
                />
                <Button type='submit' name='intent' value={INTENTS.post}>
                  {t('create')}
                </Button>
              </Stack>
            </Form>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
};
