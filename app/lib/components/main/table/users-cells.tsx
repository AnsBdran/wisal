import { Icon } from '@iconify/react';
import { Avatar, Group, Switch, Select, rem, ActionIcon } from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { useEditUserContext } from '~/lib/contexts/edit-user';
import { icons } from '~/lib/icons';
import { UserRecord } from '~/lib/types';
import { getFullName, getFullNameString } from '~/lib/utils';

export const SwitchCell = ({ defaultValue }: { defaultValue: boolean }) => {
  const { setEditUser } = useEditUserContext();
  console.log('switch cell re-rendered', defaultValue);
  return (
    <>
      <Switch
        checked={defaultValue}
        onChange={(ev) => {
          setEditUser((prev) => ({
            ...prev,
            intent: INTENTS.editUserIsFamily,
            isFamily: ev.currentTarget.checked,
          }));
        }}
        onLabel={<Icon icon={icons.star} fontSize={rem('14px')} />}
        offLabel={<Icon icon={icons.starOutline} fontSize={rem('14px')} />}
      />
    </>
  );
};
// export const SwitchCell = ({ defaultValue }: { defaultValue: boolean }) => {
//   const { setEditUser } = useEditUserContext();
//   console.log('switch cell re-rendered', defaultValue);
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
          name={getFullNameString(row)}
          color='initials'
          src={row.profileImage}
          radius='sm'
          size='sm'
        />
        {getFullName(row)}
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
//   const { t } = useTranslation('dashboard');
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
  console.log('actions cell re-rendered');

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
        <Icon icon={icons.checkMark} />
      </ActionIcon>
    </>
  );
};
