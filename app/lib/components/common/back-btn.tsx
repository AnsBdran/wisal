import { Icon } from '@iconify/react/dist/iconify.js';
import { ActionIcon } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { icons } from '~/lib/icons';

export const BackBtn = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  return (
    <ActionIcon
      onClick={() => navigate(-1)}
      variant='white'
      // color='light-dark(black, white)'
    >
      <Icon
        icon={icons.arrow}
        className={i18n.language === 'en' ? 'rotate-180' : ''}
      />
    </ActionIcon>
  );
};
