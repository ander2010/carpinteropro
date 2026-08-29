import type { Locale } from '@i18n/utils';

const intlLocaleFor: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
};

const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  es: new Intl.DateTimeFormat(intlLocaleFor.es, { day: 'numeric', month: 'long', year: 'numeric' }),
  en: new Intl.DateTimeFormat(intlLocaleFor.en, { day: 'numeric', month: 'long', year: 'numeric' }),
};

export const formatDate = (date: Date, locale: Locale = 'es'): string =>
  dateFormatters[locale].format(date);

export const toISODate = (date: Date): string => date.toISOString().split('T')[0];

/** Calcula minutos de lectura estimados a partir del contenido en texto plano (~200 wpm en español). */
export const estimateReadingTime = (plainText: string): number => {
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
