import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from '@remix-run/node';
import { useTranslations } from 'use-intl';

export const meta: MetaFunction = () => {
  return [
    { title: 'Wisal' },
    { name: 'description', content: 'Welcome to Wisal' },
  ];
};

export const loader: LoaderFunction = async () => {
  throw redirect('/feed');
};

export default function Index() {
  const t = useTranslations('common');
  return (
    <>
      <Title>{t('app_title')}</Title>
    </>
  );
}
