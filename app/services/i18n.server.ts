import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next/server';
import i18n from '~/services/i18n'; // your i18n configuration file
import { userPrefs } from './user-prefs.server';

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
    async findLocale(request) {
      const userPrefsSession = await userPrefs.getSession(
        request.headers.get('Cookie')
      );
      const locale = userPrefsSession.get('locale');

      return locale === 'en' ? 'en' : 'ar';
    },
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  backend: Backend,
});

export default i18next;
