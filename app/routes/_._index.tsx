import { Title } from '@mantine/core';
import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from '@remix-run/node';
import { useTranslation } from 'react-i18next';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader: LoaderFunction = async () => {
  return redirect('/feed');
};

export default function Index() {
  const { t } = useTranslation();
  return (
    <>
      <Title>{t('app_title')}</Title>
    </>
  );
}
