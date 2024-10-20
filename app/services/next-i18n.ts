import fs from 'fs/promises';
import path from 'path';
import { createTranslator } from 'use-intl';
import { userPrefs } from './user-prefs.server';
// import acceptLanguageParser from 'accept-language-parser';

export async function resolveLocale(request: Request) {
  // const supportedLanguages = ['en', 'ar'];
  const userPrefsSession = await userPrefs.getSession(
    request.headers.get('Cookie')
  );
  const locale = userPrefsSession.get('locale');

  // return locale === 'en' ? 'en' : 'ar';
  //   const defaultLangauge = supportedLanguages[0];
  //   const locale =
  //     acceptLanguageParser.pick(
  //       supportedLanguages,
  //       request.headers.get('accept-language') || defaultLangauge
  //     ) || defaultLangauge;

  //   return locale;
  return locale === 'en' ? 'en' : 'ar';
}

export async function getMessages(locale: string) {
  const messagesPath = path.join(process.cwd(), `./messages/${locale}.json`);
  const content = await fs.readFile(messagesPath, 'utf-8');
  return JSON.parse(content);
}

export const getTranslations = async (
  request: Request,
  forceLocale?: 'ar' | 'en'
) => {
  const locale = forceLocale ? forceLocale : await resolveLocale(request);
  return createTranslator({ locale, messages: await getMessages(locale) });
};
