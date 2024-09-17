import { Title } from '@mantine/core';
import { LoaderFunctionArgs } from '@remix-run/node';
import { redirectWithError } from 'remix-toast';
import { authenticator } from '~/services/auth.server';
import i18next from '~/services/i18n.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const t = await i18next.getFixedT(user?.locale ?? 'ar', 'common', {
    lng: user?.locale ?? 'ar',
  });
  if (!user || user.role === 'user') {
    return redirectWithError('/feed', {
      message: t('you_are_unauthorized'),
      description: t('you_are_unauthorized_description'),
    });
  }
  return null;
};

const Dashboard = () => {
  return (
    <>
      <Title>hi</Title>
    </>
  );
};

export default Dashboard;
