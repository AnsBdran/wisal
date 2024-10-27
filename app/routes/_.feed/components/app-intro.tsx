import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Divider,
  Group,
  List,
  rem,
  Title,
  Mark,
  Highlight,
} from '@mantine/core';
import styles from '../feed.module.css';
import { Icons, icons } from '~/lib/icons';
import { useTranslations } from 'use-intl';

const AppIntro = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const t = useTranslations('app_intro');
  return (
    <>
      <Box className={styles.introContainer} hidden={!opened} mt='md'>
        <Group justify='space-between'>
          <Group>
            <Title order={2}>{t('title')}</Title>
            <Badge variant='dot' color='green' size='xs'>
              {t('beta_version')}
            </Badge>
          </Group>
          <ActionIcon
            size='xl'
            variant='transparent'
            color='red'
            onClick={close}
          >
            <Icons.cancel className='normal' height='33px' />
          </ActionIcon>
        </Group>
        <Divider mb='sm' />
        <Alert icon={<Icons.info />} color='cyan'>
          <Highlight highlight='النسخة التجريبية'>
            {t('alert')}
            {/* alkjsdf */}
          </Highlight>
        </Alert>
        <Divider my='sm' />
        <Title order={3}>{t('how_to_install')}</Title>
        <List
          // icon={<Icon icon={icons.specialStar} />}
          fz='xs'
          color='dimmed'
          type='ordered'
          spacing='4px'
          ms='md'
        >
          <List.Item>
            {t('install_step_1')}
            <Mark>Google Chrome</Mark>.
          </List.Item>
          <List.Item>{t('install_step_2')}</List.Item>
          <List.Item>{t('install_step_3')}</List.Item>

          <List.Item>{t('install_step_4')}</List.Item>
          <List.Item icon={<Icons.info />}>
            {t('another_install_option')}
          </List.Item>
        </List>

        <Alert icon={<Icons.alert />} color='cyan' variant='filled'>
          {t('alert_2')}
        </Alert>
        {/* <Alert
          // c='teal'
          mt='sm'
          variant='outline'
          style={{
            borderWidth: '2px',
            borderColor:
              'light-dark(var(--mantine-color-cyan-6), var(--mantine-color-dark-4))',
            color:
              'light-dark(var(--mantine-color-cyan-9), var(--mantine-color-white))',
          }}
          // p='xs'
          py='xs'
          icon={<Icon icon={icons.info} />}
        >
          يمكنك إتباع خطوات أخرى مشابهة على متصفح آخر من اختيارك.
        </Alert> */}
      </Box>
    </>
  );
};

export default AppIntro;
