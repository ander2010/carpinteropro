import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// -----------------------------------------------------------------------------
// Fragmentos de schema reutilizados entre colecciones
// -----------------------------------------------------------------------------

/** Imagen referenciada por ruta (normalmente dentro de /public/images/...).
 *  Se usa una ruta de string en lugar del helper image() de Astro para que el
 *  contenido pueda crearse sin depender de que exista un archivo físico ya
 *  optimizado: basta con colocar el archivo en /public/images y apuntar aquí.
 */
const imageRef = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const faqItem = z.object({
  question: z.string(),
  answer: z.string(),
});

const processStep = z.object({
  title: z.string(),
  description: z.string(),
});

const seoFields = {
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonical: z.url().optional(),
  ogImage: z.string().optional(),
};

/** El panel de Decap CMS (public/admin/config.yml) usa este campo para
 *  generar el nombre de archivo/slug al crear contenido desde el navegador.
 *  No se usa en tiempo de ejecución (el slug real siempre sale del nombre de
 *  archivo/carpeta) — se declara aquí sólo para que el frontmatter que
 *  escribe el CMS pase la validación de Zod. */
const cmsSlugField = { urlSlug: z.string().optional() };

// -----------------------------------------------------------------------------
// BLOG — la colección más importante del proyecto (publicación diaria).
// -----------------------------------------------------------------------------

const blogTypes = z.enum([
  'guide',
  'howto',
  'project',
  'beforeafter',
  'video',
  'gallery',
  'faq',
  'comparison',
  'inspiration',
  'news',
  'casestudy',
]);

// El id de cada entrada queda como "<locale>/<slug>" (ej. "es/mi-articulo"),
// gracias a la subcarpeta de idioma. Ver src/i18n/utils.ts (stripLocale/withLocale).
const blog = defineCollection({
  loader: glob({
    pattern: ['{es,en}/*.mdx', '{es,en}/*.md', '{es,en}/*/index.mdx', '{es,en}/*/index.md'],
    base: './src/content/blog',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Equipo CarpinteroPro'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    type: blogTypes.default('guide'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    gallery: z.array(imageRef).optional(),
    video: z
      .object({
        url: z.string(),
        poster: z.string().optional(),
      })
      .optional(),
    youtube: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    relatedServices: z.array(z.string()).default([]),
    relatedProducts: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
    location: z.string().optional(),
    readingTime: z.number().optional(),
    ...seoFields,
    ...cmsSlugField,
  }),
});

// -----------------------------------------------------------------------------
// SERVICES — páginas comerciales estratégicas (/services/[slug])
// -----------------------------------------------------------------------------

const services = defineCollection({
  loader: glob({ pattern: '{es,en}/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    gallery: z.array(imageRef).optional(),
    icon: z.string().optional(),
    benefits: z.array(z.string()).default([]),
    process: z.array(processStep).default([]),
    faqs: z.array(faqItem).default([]),
    relatedProducts: z.array(z.string()).default([]),
    relatedProjects: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    ...seoFields,
    ...cmsSlugField,
  }),
});

// -----------------------------------------------------------------------------
// PRODUCTS — soluciones/productos de carpintería (/products/[slug])
// -----------------------------------------------------------------------------

const products = defineCollection({
  loader: glob({ pattern: '{es,en}/*.{md,mdx}', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    gallery: z.array(imageRef).optional(),
    category: z.string(),
    featured: z.boolean().default(false),
    materials: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    useCases: z.array(z.string()).default([]),
    faqs: z.array(faqItem).default([]),
    relatedServices: z.array(z.string()).default([]),
    relatedProducts: z.array(z.string()).default([]),
    relatedBlogPosts: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    order: z.number().default(0),
    ...seoFields,
    ...cmsSlugField,
  }),
});

// -----------------------------------------------------------------------------
// PROJECTS — portfolio / casos reales (/projects/[slug])
// -----------------------------------------------------------------------------

const projects = defineCollection({
  loader: glob({ pattern: '{es,en}/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroImage: z.string(),
    heroImageAlt: z.string(),
    gallery: z.array(imageRef).optional(),
    beforeImage: z.string().optional(),
    afterImage: z.string().optional(),
    services: z.array(z.string()).default([]),
    products: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),
    location: z.string().optional(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    /** Marca este proyecto como contenido DEMO (ver especificación, sección 51).
     *  Los proyectos demo se muestran con una etiqueta visible "Proyecto de ejemplo"
     *  y se excluyen del sitemap/indexación (noindex) hasta que se confirmen como reales. */
    demo: z.boolean().default(false),
    draft: z.boolean().default(false),
    ...seoFields,
    ...cmsSlugField,
  }),
});

export const collections = { blog, services, products, projects };
