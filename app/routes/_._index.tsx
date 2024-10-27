import { Title } from '@mantine/core';
import {
  LoaderFunctionArgs,
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from '@remix-run/node';
import { useTranslations } from 'use-intl';
import { authenticateOrToast } from '~/.server/utils';

export const meta: MetaFunction = () => {
  return [
    { title: 'Wisal' },
    { name: 'description', content: 'Welcome to Wisal' },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const { feedRedirect, loginRedirect, user } = await authenticateOrToast(
    request
  );
  if (user) return feedRedirect;
  return loginRedirect;
};

export default function Index() {
  const t = useTranslations('common');
  return (
    <>
      <Title>{t('app_title')}</Title>
    </>
  );
}
