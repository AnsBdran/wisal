// import { serverOnly$ } from 'vite-env-only/macros';

// import enTranslation from '../../public/locales/en/common';
// import arTranslation from '../../public/locales/ar/common';

// // This is the list of languages your application supports, the last one is your
// // fallback language
// export const supportedLngs = ['en', 'ar'];

// // This is the language you want to use in case
// // the user language is not in the supportedLngs
// export const fallbackLng = 'ar';

// // The default namespace of i18next is "translation", but you can customize it
// export const defaultNS = 'translations';
// // export const defaultNS = 'translation';

// export const resources = serverOnly$({
//   ar: { translation: arTranslation },
//   en: { translation: enTranslation },
// });

export default {
  // This is the list of languages your application supports
  supportedLngs: ['en', 'ar'],
  // This is the language you want to use in case
  // if the user language is not in the supportedLngs
  fallbackLng: 'ar',
  // The default namespace of i18next is "translation", but you can customize it here
  defaultNS: 'common',
  lng: 'ar',
};
