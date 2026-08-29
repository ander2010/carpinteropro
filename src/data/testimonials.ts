// =============================================================================
// TESTIMONIOS
// =============================================================================
// Vacío a propósito: nunca se deben generar testimonios falsos. Esta es la
// estructura de datos lista para cuando existan reseñas reales (de clientes,
// de Google, etc.). Mientras este array esté vacío, la sección de testimonios
// del home no se renderiza (ver src/components/home/Testimonials.astro).
//
// Cómo añadir un testimonio real:
// 1. Copia el bloque de ejemplo (comentado abajo) dentro del array `testimonials`.
// 2. Rellena únicamente con datos reales: nombre del cliente (o iniciales si pidió
//    anonimato), texto real, proyecto/servicio real, y fuente (Google, WhatsApp,
//    email, etc.).
// 3. La foto del cliente es opcional; si no existe, se muestra un avatar con
//    iniciales.
// =============================================================================

export interface Testimonial {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  /** Idioma en el que está escrito el testimonio ("es" o "en"). Se usa para
   *  mostrarlo sólo en la versión del sitio en ese idioma — nunca se traduce
   *  automáticamente la cita real de un cliente. */
  locale: 'es' | 'en';
  /** Servicio o proyecto relacionado (slug de src/content/services o /projects). */
  relatedService?: string;
  /** De dónde proviene la reseña: "Google", "WhatsApp", "Email", etc. */
  source: string;
  date: string; // YYYY-MM-DD
  location?: string;
}

// Ejemplo de formato (NO activo, sólo referencia):
// {
//   id: "cliente-maria-g",
//   authorName: "María G.",
//   rating: 5,
//   quote: "Texto real de la reseña del cliente...",
//   locale: "es",
//   relatedService: "closets-a-medida",
//   source: "Google",
//   date: "2026-03-10",
//   location: "Miami, FL",
// }

export const testimonials: Testimonial[] = [];
