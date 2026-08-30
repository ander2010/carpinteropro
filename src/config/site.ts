// =============================================================================
// CONFIGURACIÓN GENERAL DEL SITIO
// =============================================================================
// Ajustes globales que no son "datos de empresa" (eso vive en business.ts) sino
// configuración de la aplicación: nombre de marca para <title>, idioma, imagen
// social por defecto, categorías de contenido, etc.
// =============================================================================

import type { Locale } from '@i18n/utils';

export const site = {
  /** Usado como sufijo de <title> en la mayoría de páginas: "Página | CarpinteroPro". */
  brandName: 'CarpinteroPro',
  /** Imagen Open Graph / Twitter por defecto (1200x630), relativa a /public o /src/images. */
  defaultOgImage: '/og-default.png',
} as const;

export const ogLocaleFor: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_US',
};

export const langFor: Record<Locale, string> = {
  es: 'es',
  en: 'en',
};

export const defaultDescriptionFor: Record<Locale, string> = {
  es: 'Cuéntanos tu proyecto de carpintería a medida y te contacta directamente un carpintero profesional en Florida. Closets, cocinas, muebles y más, sin buscar contratista por tu cuenta.',
  en: 'Tell us about your custom carpentry project and a professional carpenter in Florida will contact you directly. Closets, kitchens, furniture and more, without searching for a contractor on your own.',
};

/** Categorías de contenido iniciales para el blog y los hubs de contenido (/blog/category/[slug]).
 *  El slug de la categoría es el mismo en ambos idiomas (para mantener URLs simples); sólo
 *  cambia la etiqueta visible. */
export const blogCategories = [
  { slug: 'carpinteria', label: { es: 'Carpintería', en: 'Carpentry' } },
  { slug: 'muebles-a-medida', label: { es: 'Muebles a medida', en: 'Custom Furniture' } },
  { slug: 'cocinas', label: { es: 'Cocinas', en: 'Kitchens' } },
  { slug: 'closets', label: { es: 'Closets', en: 'Closets' } },
  { slug: 'gabinetes', label: { es: 'Gabinetes', en: 'Cabinets' } },
  { slug: 'madera', label: { es: 'Madera', en: 'Wood' } },
  { slug: 'diseno', label: { es: 'Diseño', en: 'Design' } },
  { slug: 'reparaciones', label: { es: 'Reparaciones', en: 'Repairs' } },
  { slug: 'consejos', label: { es: 'Consejos', en: 'Tips' } },
  { slug: 'proyectos', label: { es: 'Proyectos', en: 'Projects' } },
  { slug: 'inspiracion', label: { es: 'Inspiración', en: 'Inspiration' } },
] as const;

export type BlogCategorySlug = (typeof blogCategories)[number]['slug'];

export const getCategoryLabel = (slug: string, locale: Locale): string =>
  blogCategories.find((c) => c.slug === slug)?.label[locale] ?? slug;
