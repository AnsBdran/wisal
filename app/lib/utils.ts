import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjsAr from 'dayjs/locale/ar';

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

export const fullName = (user) => `${user.firstName} ${user.lastName}`;
export const firstLetters = (user) =>
  `${user.firstName.charAt(0)} ${user.lastName.charAt(0)}`;
