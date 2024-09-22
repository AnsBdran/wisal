import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjsAr from 'dayjs/locale/ar';
import { ReactionType } from '~/.server/db/schema';
import { UserRecord } from './types';
import { Group, rem, Text } from '@mantine/core';
import { Icon } from '@iconify/react';
import { createColumnHelper, flexRender } from '@tanstack/react-table';
import { icons } from './icons';
import {
  CellActions,
  RoleCell,
  SwitchCell,
  UserCell,
} from './components/main/table/bits';

export const fromNow = (date: string, lang: string) => {
  dayjs.extend(relativeTime);

  if (lang === 'ar') {
    // dayjs.locale('ar');
    dayjs.locale(dayjsAr);
  } else {
    dayjs.locale('en');
  }
  return dayjs(date).fromNow();
  // return dayjs(date).locale('es').fromNow()
};

export const getFullName = (user: UserRecord) => {
  return (
    <Group gap='2px'>
      <Text>
        {user.firstName} {user.lastName}
      </Text>
      {user.isFamily ||
        (user.role === 'super_admin' && (
          <Icon
            icon={icons.verified}
            fontSize={rem('14px')}
            color='var(--mantine-primary-color-9)'
          />
        ))}
    </Group>
  );
};

export const getFullNameString = (user) => `${user.firstName} ${user.lastName}`;
export const firstLetters = (user) =>
  `${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`;

export const getReactionIconData = (type: typeof ReactionType.enumName) => {
  switch (type) {
    case 'like':
      return { icon: 'fluent-emoji:thumbs-up', color: 'blue' };
    case 'love':
      return { icon: 'fluent-emoji:smiling-face-with-hearts', color: 'red' };
    case 'haha':
      return {
        icon: 'fluent-emoji:rolling-on-the-floor-laughing',
        color: 'darkYellow',
      };
    case 'wow':
      return { icon: 'noto:astonished-face', color: 'red' };
    case 'sad':
      return { icon: 'noto:sad-but-relieved-face', color: 'dark' };
    case 'dislike':
      return { icon: 'fluent-emoji:thumbs-down', color: 'orange' };
    case 'angry':
      return { icon: 'fluent-emoji:angry-face', color: 'red' };
    default:
      return { icon: '', color: '' };
  }
};

export const getUsersColumns = () => {
  const columnHelper = createColumnHelper<UserRecord>();

  return [
    columnHelper.display({
      header: 'user',
      cell: (props) => flexRender(UserCell, { row: props.row.original }),
    }),
    // columnHelper.accessor('role', {
    //   header: 'role',
    //   cell: (info) =>
    //     flexRender(RoleCell, {
    //       defaultValue: info.getValue(),
    //       userID: info.row.original.id,
    //     }),
    // }),
    columnHelper.accessor('isFamily', {
      header: 'is_family',
      cell: (info) =>
        flexRender(SwitchCell, {
          defaultValue: info.getValue(),
        }),
    }),
    columnHelper.display({
      header: 'actions',
      cell: (props) => flexRender(CellActions, { row: props.row.original }),
    }),
  ];
};

export const waiit = async (time: number = 1000) => {
  return await new Promise((res) => setTimeout(res, time));
};
