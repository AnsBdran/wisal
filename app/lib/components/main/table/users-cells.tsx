import { Avatar, Group, Switch, rem, ActionIcon } from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { useEditUserContext } from '~/lib/contexts/edit-user';
import { Icons } from '~/lib/icons';
import { UserRecord } from '~/lib/types';
import { getProfileInfoText, getFullName } from '~/lib/utils';

export const SwitchCell = ({ defaultValue }: { defaultValue: boolean }) => {
  const { setEditUser } = useEditUserContext();
  return (
    <>
      <Switch
        checked={defaultValue}
        onChange={(ev) => {
          setEditUser((prev) => ({
            ...prev,
            intent: INTENTS.editUserIsFamily,
            isFamily: ev.currentTarget?.checked,
          }));
        }}
        onLabel={<Icons.star fontSize={rem('14px')} />}
        offLabel={<Icons.star fontSize={rem('14px')} />}
      />
    </>
  );
};
// export const SwitchCell = ({ defaultValue }: { defaultValue: boolean }) => {
//   const { setEditUser } = useEditUserContext();
//   return (
//     <>
//       <Switch
//         defaultChecked={defaultValue}
//         onChange={(ev) => {
//           setEditUser((prev) => ({
//             ...prev,
//             intent: INTENTS.editUserIsFamily,
//             isFamily: ev.currentTarget.checked,
//           }));
//         }}
//         onLabel={<Icon icon={icons.star} fontSize={rem('14px')} />}
//         offLabel={<Icon icon={icons.starOutline} fontSize={rem('14px')} />}
//       />
//     </>
//   );
// };

export const UserCell = ({ row }: { row: UserRecord }) => {
  return (
    <>
      <Group>
        <Avatar
          name={getFullName(row)}
          color='initials'
          src={row.profileImage}
          radius='sm'
          size='sm'
        />
        {getProfileInfoText(row)}
      </Group>
    </>
  );
};

// export const RoleCell = ({
//   defaultValue,
// }: {
//   defaultValue: UserRole;
//   userID: number;
// }) => {
//   const { t } = useTranslations('dashboard');
//   const { setEditUser } = useEditUserContext();
//   return (
//     <>
//       <Select
//         data={[
//           { label: t('a_user'), value: 'user' },
//           { label: t('admin'), value: 'admin' },
//           { label: t('super_admin'), value: 'super_admin' },
//         ]}
//         defaultValue={defaultValue}
//         onChange={(value) => {
//           setEditUser({
//             intent: INTENTS.editUserRole,
//             role: value as UserRole,
//           });
//         }}
//       />
//     </>
//   );
// };

export const CellActions = ({ row }: { row: UserRecord }) => {
  const fetcher = useFetcher();
  const { editUser } = useEditUserContext();

  const submit = () => {
    fetcher.submit(
      {
        userID: row.id,
        intent: editUser.intent,
        role: editUser.role ?? '',
        isFamily: editUser.isFamily ?? '',
      },
      {
        // action: '/dashboard/users',
        method: 'POST',
      }
    );
  };
  return (
    <>
      <ActionIcon onClick={submit} size='sm' variant='subtle'>
        <Icons.checkMark />
      </ActionIcon>
    </>
  );
};
