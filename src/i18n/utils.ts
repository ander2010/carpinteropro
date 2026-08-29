import { ui, defaultLocale, type Locale, type UiKey } from './ui';

/** Devuelve un traductor t(key) ligado a un idioma concreto. */
export const useTranslations = (locale: Locale) => {
  return (key: UiKey): string => ui[locale][key] ?? ui[defaultLocale][key] ?? key;
};

/**
 * Antepone el prefijo de idioma a una ruta interna cuando corresponde.
 * Español (idioma por defecto) no lleva prefijo: getLocalizedPath('es', '/services') → '/services'
 * Inglés sí: getLocalizedPath('en', '/services') → '/en/services'
 */
export const getLocalizedPath = (locale: Locale, path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return cleanPath;
  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
};

/**
 * Dada una URL de la página actual, calcula la ruta equivalente en el otro
 * idioma. Se usa para el selector de idioma y para <link rel="alternate">.
 * `unprefixedPath` es la ruta SIN prefijo de idioma (ej. "/services/closets-a-medida").
 */
export const getAlternateLocalePaths = (unprefixedPath: string): Record<Locale, string> => ({
  es: getLocalizedPath('es', unprefixedPath),
  en: getLocalizedPath('en', unprefixedPath),
});

/** Extrae el slug de una colección (quita el prefijo de idioma del id: "es/mi-slug" → "mi-slug"). */
export const stripLocale = (id: string): string => id.split('/').slice(1).join('/');

/** Antepone el prefijo de idioma a un id de colección: ("es", "mi-slug") → "es/mi-slug". */
export const withLocale = (locale: Locale, slug: string): string => `${locale}/${slug}`;

export type { Locale };
