import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjsAr from 'dayjs/locale/ar';
import { ReactionType } from '~/.server/db/schema';
import { User } from './types';
import { Group, rem, Text } from '@mantine/core';
import { Icon } from '@iconify/react';
import { icons } from './icons';

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

export const getFullName = (user: User) => {
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
