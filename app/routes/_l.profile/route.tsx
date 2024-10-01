import { Avatar, Text, Button, Paper } from '@mantine/core';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticateOrToast } from '~/.server/utils';
import { getFullName } from '~/lib/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { loginRedirect, user } = await authenticateOrToast(request);
  if (!user) return loginRedirect;

  return json({ user });
};

const Profile = () => {
  const { user } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  console.log('user', user);
  return (
    <Paper radius='md' withBorder p='lg' bg='var(--mantine-color-body)'>
      <Avatar
        src={user.profileImage}
        size={120}
        // radius={120}
        radius='md'
        color='initials'
        mx='auto'
        name={getFullName(user)}
      />
      <Text ta='center' fz='lg' fw={500} mt='md'>
        {getFullName(user)}
      </Text>
      <Text ta='center' c='dimmed' fz='sm'>
        {user.bio}
      </Text>

      <Button
        variant='default'
        fullWidth
        mt='md'
        component={Link}
        to='/settings'
      >
        {t('edit_profile')}
      </Button>
    </Paper>
  );
};

export default Profile;
