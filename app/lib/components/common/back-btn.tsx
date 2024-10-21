import { Icon } from '@iconify/react/dist/iconify.js';
import { ActionIcon, ActionIconVariant } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useLocale, useTranslations } from 'use-intl';
import { icons } from '~/lib/icons';

export const BackBtn = ({
  color = 'black',
  variant = 'filled',
}: {
  color?: string;
  variant?: ActionIconVariant;
}) => {
  const navigate = useNavigate();
  const locale = useLocale();
  return (
    <ActionIcon
      onClick={() => navigate(-1)}
      color={color}
      variant={variant}
      // variant='white'
      // color='light-dark(black, white)'
    >
      <Icon
        icon={icons.arrow}
        className={locale === 'en' ? 'rotate-180' : ''}
      />
    </ActionIcon>
  );
};
