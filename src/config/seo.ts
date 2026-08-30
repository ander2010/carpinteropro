// =============================================================================
// CONFIGURACIÓN SEO
// =============================================================================
// Plantillas de title/description y helpers de URLs absolutas. El componente
// src/components/seo/SEO.astro es el único consumidor "oficial" de este archivo,
// pero cualquier página puede importar buildTitle()/absoluteUrl() si lo necesita.
// =============================================================================

import { business } from './business';
import { site, defaultDescriptionFor } from './site';
import type { Locale } from '@i18n/utils';

const homeTitleFor: Record<Locale, string> = {
  es: `${site.brandName} | Conecta con Carpinteros de Confianza en Florida`,
  en: `${site.brandName} | Connect with Trusted Carpenters in Florida`,
};

export const seoDefaults = {
  titleTemplate: (pageTitle: string) => `${pageTitle} | ${site.brandName}`,
  homeTitleFor,
  defaultDescriptionFor,
  twitterCardType: 'summary_large_image' as const,
};

/** Convierte una ruta relativa ("/services/closets") en URL absoluta usando el dominio canónico. */
export const absoluteUrl = (path: string): string => {
  const base = business.domain.replace(/\/$/, '');
  if (!path || path === '/') return `${base}/`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * Construye un <title> siguiendo la estrategia de titles del proyecto (sección 24).
 * Si el título recibido ya termina en "| CarpinteroPro" (por ejemplo, un campo
 * `seoTitle` de una colección de contenido que ya define el title completo), se
 * usa tal cual para no duplicar el sufijo de marca.
 */
export const buildTitle = (locale: Locale, pageTitle?: string): string => {
  if (!pageTitle) return seoDefaults.homeTitleFor[locale];
  if (pageTitle.trim().endsWith(`| ${site.brandName}`)) return pageTitle.trim();
  return seoDefaults.titleTemplate(pageTitle);
};
