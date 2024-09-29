import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjsAr from 'dayjs/locale/ar';
import { ReactionType } from '~/.server/db/schema';
import { Choice, Suggestion, UserRecord } from './types';
import { Avatar, Group, Indicator, rem, Text } from '@mantine/core';
import { Icon } from '@iconify/react';
import { createColumnHelper, flexRender } from '@tanstack/react-table';
import { icons } from './icons';
import {
  CellActions,
  RoleCell,
  SwitchCell,
  UserCell,
} from './components/main/table/users-cells';
import {
  SuggestionActions,
  IsAcceptedChip,
  Description,
  SuggestionChoices,
} from './components/main/table/suggestions-cells';

export const fromNow = (date: string, locale: string) => {
  dayjs.extend(relativeTime);

  if (locale === 'ar') {
    // dayjs.locale('ar');
    dayjs.locale(dayjsAr);
  } else {
    dayjs.locale('en');
  }
  return dayjs(date).fromNow();
  // return dayjs(date).locale('es').fromNow()
};

export const getProfileInfo = (user: UserRecord, sm?: boolean) => {
  return (
    <Group gap='xs'>
      {(user.role !== 'super_admin') ? (
             <Avatar
             src={user.profileImage}
             color='initials'
             name={getFullName(user)}
             radius={'xs'}
             size={sm ? 'sm' : 'md'}
             /> 
      ) : (
        <Indicator  
        label={ <Icon
        icon={icons.verified}
        fontSize={rem('14px')}
        color='var(--mantine-primary-color-9)'
        />}
         color='transparent'>

      <Avatar
        src={user.profileImage}
        color='initials'
        name={getFullName(user)}
        radius={'xs'}
            size={sm ? 'sm' : 'md'}
        />
        </Indicator>
      )}
      <Text>
        {user.firstName} {user.lastName}
      </Text>
      {/* {user.isFamily ||
        (user.role === 'super_admin' && (
          <Icon
            icon={icons.verified}
            fontSize={rem('14px')}
            color='var(--mantine-primary-color-9)'
          />
        ))} */}
    </Group>
  );
};
export const getProfileInfoText = (user: UserRecord) => {
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

export const getFullName = (user) => `${user.firstName} ${user.lastName}`;
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

export const getSuggestionsColumns = () => {
  const columnHelper = createColumnHelper<Suggestion & { choices: Choice[] }>();
  return [
    columnHelper.accessor('title', {
      header: 'title',
    }),
    columnHelper.accessor('description', {
      header: 'description',
      cell: (info) => flexRender(Description, { value: info.getValue() }),
    }),
    columnHelper.accessor('isAccepted', {
      header: 'is_accepted',
      cell: (info) =>
        flexRender(IsAcceptedChip, {
          defaultValue: info.getValue(),
          choicesCount: info.row.original.choices.length,
          id: info.row.original.id,
        }),
    }),
    columnHelper.accessor('choices', {
      header: 'choices',
      cell: (info) =>
        flexRender(SuggestionChoices, { choices: info.getValue() }),
    }),
    columnHelper.display({
      header: 'actions',
      cell: (info) => flexRender(SuggestionActions, { row: info.row.original }),
    }),
  ];
};
