import { ActionIcon, ActionIconVariant } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import { useLocale } from 'use-intl';
import { Icons } from '~/lib/icons';

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
    <ActionIcon onClick={() => navigate(-1)} color={color} variant={variant}>
      <Icons.back className={locale === 'en' ? 'rotate-180' : ''} />
    </ActionIcon>
  );
};
