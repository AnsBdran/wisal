import { ActionIcon, Group, rem, ThemeIcon, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { icons } from '~/lib/icons';
import { Icon } from '@iconify/react';
import styles from '../feed.module.css';

export const FeedHeader = ({
  toggleIntro,
  introOpened,
  postFormOpen,
}: {
  toggleIntro: () => void;
  postFormOpen: () => void;
  introOpened: boolean;
}) => {
  const { t } = useTranslation('feed');
  return (
    <Group justify='space-between' className={styles.feedHeader}>
      <Group>
        <ThemeIcon
          color='cyan'
          variant='transparent'
          w={rem('24px')}
          h={rem('24px')}
        >
          <Icon icon={icons.post} />
        </ThemeIcon>
        <Title order={2}>{t('posts')}</Title>
      </Group>
      <Group>
        <ActionIcon
          onClick={toggleIntro}
          variant={introOpened ? 'outline' : 'filled'}
          color='cyan'
        >
          <Icon icon={icons.info} />
        </ActionIcon>
        <ActionIcon onClick={postFormOpen} color='cyan'>
          <Icon icon={icons.add} />
        </ActionIcon>
      </Group>
    </Group>
  );
};
