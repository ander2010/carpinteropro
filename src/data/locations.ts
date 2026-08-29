// =============================================================================
// PÁGINAS DE UBICACIÓN (/locations/[slug])
// =============================================================================
// A propósito, este array empieza VACÍO. No se ha inventado ninguna ciudad.
//
// Regla del proyecto (ver especificación, sección 29): nunca publicar decenas
// de páginas casi idénticas cambiando sólo el nombre de la ciudad. Cada entrada
// que agregues aquí generará una página real en /locations/[slug], así que sólo
// debe añadirse una ciudad cuando exista contenido ÚNICO y verídico para ella:
// proyectos reales hechos allí, testimonios reales, fotos reales, matices reales
// del servicio en esa zona.
//
// Cómo añadir una ciudad:
// 1. Añade primero la ciudad a `business.serviceAreas` en src/config/business.ts
//    (eso la muestra en la sección "Áreas donde trabajamos" del home/footer,
//    sin necesidad de crear una página dedicada).
// 2. Sólo si además quieres una landing page SEO específica para esa ciudad,
//    añade aquí una entrada con contenido propio (no una plantilla genérica).
// 3. src/pages/locations/[slug].astro leerá este array automáticamente.
// =============================================================================

export interface LocationEntry {
  slug: string;
  /** Idioma de esta entrada ("es" o "en"). Añade una entrada por idioma con el
   *  mismo `slug` cuando quieras la página en ambos — nunca se traduce
   *  automáticamente el contenido de una ciudad. */
  locale: 'es' | 'en';
  city: string;
  region?: string;
  /** Introducción única para esta ciudad (2-4 frases). Nada de texto genérico reciclado. */
  intro: string;
  /** Slugs de servicios (src/content/services) realmente ofrecidos en esta zona. */
  services: string[];
  /** Slugs de proyectos reales (src/content/projects) realizados en esta ciudad, si existen. */
  projectSlugs?: string[];
  /** FAQs específicas de esta ubicación, si aportan algo que las FAQs generales no cubren. */
  faqs?: { question: string; answer: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export const locations: LocationEntry[] = [];
