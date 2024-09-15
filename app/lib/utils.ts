import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjsAr from 'dayjs/locale/ar';
import { ReactionType } from '~/.server/db/schema';

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

export const getFullName = (user) => `${user.firstName} ${user.lastName}`;
export const firstLetters = (user) =>
  `${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`;

export const getReactionIconData = (type: typeof ReactionType.enumName) => {
  switch (type) {
    case 'like':
      return { icon: 'noto:thumbs-up', color: 'blue' };
    case 'love':
      return { icon: 'noto:heart-suit', color: 'red' };
    case 'haha':
      return {
        icon: 'noto:rolling-on-the-floor-laughing',
        color: 'darkYellow',
      };
    case 'wow':
      return { icon: 'noto:astonished-face', color: 'red' };
    case 'sad':
      return { icon: 'noto:sad-but-relieved-face', color: 'dark' };
    case 'dislike':
      return { icon: 'noto:thumbs-down', color: 'orange' };
    case 'angry':
      return { icon: 'noto:angry-face', color: 'red' };
    default:
      return { icon: '', color: '' };
  }
};
