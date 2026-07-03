import { create } from 'zustand';
import { useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../core/storage/storage';
import { en, hi, type Locale, type TranslationKey } from './translations';

const translations = { en, hi };

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  loadLocale: () => Promise<void>;
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: 'en',

  setLocale: async (locale) => {
    await setItem(STORAGE_KEYS.LOCALE, locale);
    set({ locale });
  },

  loadLocale: async () => {
    const saved = await getItem<Locale>(STORAGE_KEYS.LOCALE);
    if (saved) set({ locale: saved });
  },
}));

export function useTranslation() {
  const locale = useI18nStore((s) => s.locale);
  const setLocale = useI18nStore((s) => s.setLocale);

  const t = useCallback(
    (key: TranslationKey) => translations[locale][key] ?? translations.en[key],
    [locale],
  );

  return { t, locale, setLocale };
}
