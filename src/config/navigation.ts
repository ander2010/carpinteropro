// =============================================================================
// NAVEGACIÓN PRINCIPAL
// =============================================================================
// Un único lugar para editar el menú del header y del footer. Las funciones
// reciben `locale` y devuelven textos traducidos + rutas ya prefijadas
// correctamente para ese idioma (ver src/i18n/utils.ts).
// =============================================================================

import { useTranslations, getLocalizedPath, type Locale } from '@i18n/utils';

export interface NavItem {
  label: string;
  href: string;
}

/** Navegación principal del header (obligatoria según especificación del proyecto). */
export const getMainNav = (locale: Locale): NavItem[] => {
  const t = useTranslations(locale);
  return [
    { label: t('nav.home'), href: getLocalizedPath(locale, '/') },
    { label: t('nav.products'), href: getLocalizedPath(locale, '/products') },
    { label: t('nav.services'), href: getLocalizedPath(locale, '/services') },
    { label: t('nav.blog'), href: getLocalizedPath(locale, '/blog') },
    { label: t('nav.contact'), href: getLocalizedPath(locale, '/contact') },
  ];
};

export type FooterColumnKey = 'company' | 'services' | 'products' | 'legal';

/** Enlaces adicionales del footer, agrupados por columna. `key` identifica la
 *  columna de forma estable (independiente del idioma) para que los componentes
 *  puedan inyectar listas dinámicas (servicios/productos) sin comparar texto traducido. */
export const getFooterNav = (
  locale: Locale,
): { key: FooterColumnKey; title: string; items: NavItem[] }[] => {
  const t = useTranslations(locale);
  return [
    {
      key: 'company',
      title: t('footer.company'),
      items: [
        { label: t('nav.about'), href: getLocalizedPath(locale, '/about') },
        { label: t('nav.projects'), href: getLocalizedPath(locale, '/projects') },
        { label: t('nav.blog'), href: getLocalizedPath(locale, '/blog') },
        { label: t('nav.faq'), href: getLocalizedPath(locale, '/faq') },
        { label: t('nav.contact'), href: getLocalizedPath(locale, '/contact') },
      ],
    },
    { key: 'services', title: t('footer.services'), items: [] },
    { key: 'products', title: t('footer.products'), items: [] },
    {
      key: 'legal',
      title: t('footer.legal'),
      items: [
        { label: t('nav.privacy'), href: getLocalizedPath(locale, '/privacy-policy') },
        { label: t('nav.terms'), href: getLocalizedPath(locale, '/terms') },
        { label: t('nav.sitemap'), href: '/sitemap-index.xml' },
      ],
    },
  ];
};

export const getPrimaryCta = (locale: Locale): NavItem => ({
  label: useTranslations(locale)('cta.quote'),
  href: getLocalizedPath(locale, '/contact'),
});

export const getSecondaryCta = (locale: Locale): NavItem => ({
  label: useTranslations(locale)('cta.seeWork'),
  href: getLocalizedPath(locale, '/projects'),
});
