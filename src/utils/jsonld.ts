// =============================================================================
// STRUCTURED DATA / JSON-LD — helpers type-safe
// =============================================================================
// Reglas del proyecto (sección 26): el schema SOLO debe reflejar contenido
// visible y real. Nunca generar reviews, ratings, precios, direcciones u
// horarios falsos. Cada helper de aquí comprueba la disponibilidad del dato en
// business.ts antes de incluirlo.
// =============================================================================

import { business, hasAddress, hasOpeningHours, hasRating, getSameAsUrls } from '@config/business';
import { absoluteUrl } from '@config/seo';

export const organizationSchema = () => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: business.name,
    url: business.domain,
  };
  const logo = absoluteUrl('/images/brand/logo.svg');
  if (logo) schema.logo = logo;
  const sameAs = getSameAsUrls();
  if (sameAs.length > 0) schema.sameAs = sameAs;
  if (business.email) schema.email = business.email;
  if (business.phone) schema.telephone = business.phone;
  return schema;
};

export const localBusinessSchema = () => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: business.name,
    url: business.domain,
    image: absoluteUrl('/images/brand/logo.svg'),
  };

  if (business.phone) schema.telephone = business.phone;
  if (business.email) schema.email = business.email;
  if (business.priceRange) schema.priceRange = business.priceRange;

  if (hasAddress() && business.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    };
  }

  if (business.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    };
  }

  if (hasOpeningHours()) {
    schema.openingHoursSpecification = business.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    }));
  }

  if (business.serviceAreas.length > 0) {
    schema.areaServed = business.serviceAreas.map((a) => a.name);
  }

  if (hasRating() && business.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
    };
  }

  const sameAs = getSameAsUrls();
  if (sameAs.length > 0) schema.sameAs = sameAs;

  return schema;
};

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: business.name,
  url: business.domain,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${business.domain}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const articleSchema = (opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishDate: Date;
  updatedDate?: Date;
  author: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: opts.title,
  description: opts.description,
  mainEntityOfPage: absoluteUrl(opts.path),
  ...(opts.image ? { image: [absoluteUrl(opts.image)] } : {}),
  datePublished: opts.publishDate.toISOString(),
  dateModified: (opts.updatedDate ?? opts.publishDate).toISOString(),
  author: {
    '@type': 'Person',
    name: opts.author,
  },
  publisher: {
    '@type': 'Organization',
    name: business.name,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/brand/logo.svg'),
    },
  },
});

export const serviceSchema = (opts: { title: string; description: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: opts.title,
  description: opts.description,
  url: absoluteUrl(opts.path),
  provider: {
    '@type': 'HomeAndConstructionBusiness',
    name: business.name,
    url: business.domain,
  },
  ...(business.serviceAreas.length > 0
    ? { areaServed: business.serviceAreas.map((a) => a.name) }
    : {}),
});

export const videoObjectSchema = (opts: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: Date;
  contentUrl?: string;
  embedUrl?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: opts.name,
  description: opts.description,
  thumbnailUrl: [absoluteUrl(opts.thumbnailUrl)],
  uploadDate: opts.uploadDate.toISOString(),
  ...(opts.contentUrl ? { contentUrl: opts.contentUrl } : {}),
  ...(opts.embedUrl ? { embedUrl: opts.embedUrl } : {}),
});

export const webPageSchema = (opts: { title: string; description: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: opts.title,
  description: opts.description,
  url: absoluteUrl(opts.path),
});
