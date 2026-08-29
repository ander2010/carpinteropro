// =============================================================================
// CONFIGURACIÓN CENTRAL DEL NEGOCIO — CarpinteroPro
// =============================================================================
// Este es EL ÚNICO archivo donde deben editarse los datos reales de la empresa:
// teléfono, WhatsApp, email, dirección, horarios, ciudades, redes sociales, etc.
//
// Ningún componente del sitio debe tener estos datos escritos "a mano": todos
// deben importar y leer este archivo. Así, para lanzar a producción, sólo hace
// falta completar los campos marcados como vacíos ("") o `null` aquí abajo.
//
// IMPORTANTE: los campos vacíos NO se muestran en el sitio. Los componentes
// (header, footer, WhatsApp CTA, Schema.org, etc.) comprueban si el dato existe
// antes de renderizarlo. No se ha inventado ningún dato de contacto, dirección,
// horario, ciudad, red social, valoración ni años de experiencia.
// =============================================================================

export interface OpeningHours {
  /** Días que cubre este bloque de horario. */
  days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  /** Hora de apertura en formato 24h, ej. "08:00". */
  opens: string;
  /** Hora de cierre en formato 24h, ej. "17:00". */
  closes: string;
}

export interface ServiceArea {
  /** Nombre de la ciudad/zona tal y como se debe mostrar. */
  name: string;
  /** Región/estado/provincia (opcional). */
  region?: string;
  /** Slug para /locations/[slug]. Debe existir una entrada en src/data/locations.ts
   *  con contenido único antes de publicar esa página. */
  slug?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
  linkedin?: string;
  googleBusiness?: string;
}

export interface BusinessConfig {
  /** Nombre comercial. */
  name: string;
  /** Razón social / nombre legal, si es diferente al comercial. */
  legalName: string | null;
  /** Eslogan corto, opcional. */
  tagline: string | null;
  /** Dominio canónico, sin barra final. */
  domain: string;

  /** Teléfono en formato E.164 para enlaces tel:, ej. "+13051234567". Vacío = oculto. */
  phone: string;
  /** Teléfono formateado para mostrar en pantalla, ej. "(305) 123-4567". */
  phoneDisplay: string;
  /** Número de WhatsApp en formato internacional sin "+" ni espacios, ej. "13051234567". */
  whatsapp: string;
  /** Email de contacto público. */
  email: string;

  /** Dirección física. Déjalo en null si la empresa no tiene local público
   *  o no desea publicar su dirección (muy común en carpinteros que trabajan
   *  a domicilio/taller privado). */
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  } | null;

  /** Coordenadas para el schema LocalBusiness / mapas. null si no hay dirección pública. */
  geo: {
    latitude: number;
    longitude: number;
  } | null;

  /** Horarios de atención. Array vacío = no se muestra bloque de horarios. */
  openingHours: OpeningHours[];

  /** Ciudades/zonas donde se ofrece servicio. Se usa en la sección "Áreas donde
   *  trabajamos" y para generar (opcionalmente) /locations/[slug]. */
  serviceAreas: ServiceArea[];

  /** Redes sociales. Cada campo vacío/undefined se omite del footer y del schema. */
  social: SocialLinks;

  /** Perfil de Google Business (URL directa a la ficha). */
  googleBusinessProfileUrl: string | null;

  /** Años de experiencia. null = no se muestra ninguna cifra inventada. */
  yearsOfExperience: number | null;

  /** Número de proyectos completados. null = no se muestra. */
  projectsCompleted: number | null;

  /** Valoración media y cantidad de reseñas (debe provenir de Google/otra fuente
   *  real). null = no se renderiza AggregateRating ni estrellas en ningún lado. */
  rating: {
    value: number;
    count: number;
    source: string;
  } | null;

  /** Licencias / certificaciones reales, ej. "License #CGC000000". Array vacío = oculto. */
  licenses: string[];

  /** Rango de precios orientativo para schema.org (ej. "$$"). null = se omite. */
  priceRange: string | null;
}

export const business: BusinessConfig = {
  name: 'CarpinteroPro',
  legalName: null,
  tagline: null,
  domain: 'https://carpinteropro.com',

  phone: '',
  phoneDisplay: '',
  whatsapp: '',
  email: '',

  address: null,
  geo: null,

  openingHours: [],

  serviceAreas: [],

  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    tiktok: '',
    pinterest: '',
    linkedin: '',
    googleBusiness: '',
  },

  googleBusinessProfileUrl: null,
  yearsOfExperience: null,
  projectsCompleted: null,
  rating: null,
  licenses: [],
  priceRange: null,
};

// -----------------------------------------------------------------------------
// Helpers — usar estos en los componentes en lugar de leer los campos "a pelo".
// Así, si un dato falta, el componente que lo usa puede decidir no renderizarse.
// -----------------------------------------------------------------------------

export const hasPhone = (): boolean => business.phone.trim().length > 0;
export const hasWhatsApp = (): boolean => business.whatsapp.trim().length > 0;
export const hasEmail = (): boolean => business.email.trim().length > 0;
export const hasAddress = (): boolean => business.address !== null;
export const hasOpeningHours = (): boolean => business.openingHours.length > 0;
export const hasServiceAreas = (): boolean => business.serviceAreas.length > 0;
export const hasRating = (): boolean => business.rating !== null;

export const getPhoneHref = (): string => `tel:${business.phone.replace(/[^\d+]/g, '')}`;

export const getEmailHref = (): string => `mailto:${business.email}`;

/**
 * Genera un enlace wa.me con mensaje precargado.
 * @param message Mensaje por defecto. Si no se indica, se usa uno genérico.
 */
export const getWhatsAppHref = (message?: string): string => {
  const defaultMessage = `Hola ${business.name}, quiero solicitar información sobre un proyecto de carpintería.`;
  const text = encodeURIComponent(message ?? defaultMessage);
  return `https://wa.me/${business.whatsapp}?text=${text}`;
};

export const getActiveSocialLinks = (): { key: keyof SocialLinks; url: string }[] => {
  return (Object.entries(business.social) as [keyof SocialLinks, string | undefined][])
    .filter(([, url]) => Boolean(url && url.trim().length > 0))
    .map(([key, url]) => ({ key, url: url as string }));
};

export const getSameAsUrls = (): string[] => getActiveSocialLinks().map((s) => s.url);
