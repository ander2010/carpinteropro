import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@i18n/utils';
import { stripLocale } from '@i18n/utils';

const isProd = import.meta.env.PROD;

const forLocale = <T extends { id: string }>(items: T[], locale: Locale): T[] =>
  items.filter((item) => item.id.startsWith(`${locale}/`));

/** Entradas publicables: excluye drafts en producción (en dev se ven para poder revisarlos). */
export const getPublishedBlogPosts = async (locale: Locale): Promise<CollectionEntry<'blog'>[]> => {
  const posts = await getCollection('blog', ({ data }) => !isProd || !data.draft);
  return forLocale(posts, locale)
    .filter((p) => !isProd || p.data.publishDate <= new Date())
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
};

export const getPublishedServices = async (
  locale: Locale,
): Promise<CollectionEntry<'services'>[]> => {
  const services = await getCollection('services', ({ data }) => !isProd || !data.draft);
  return forLocale(services, locale).sort((a, b) => a.data.order - b.data.order);
};

export const getPublishedProducts = async (
  locale: Locale,
): Promise<CollectionEntry<'products'>[]> => {
  const products = await getCollection('products', ({ data }) => !isProd || !data.draft);
  return forLocale(products, locale).sort((a, b) => a.data.order - b.data.order);
};

export const getPublishedProjects = async (
  locale: Locale,
): Promise<CollectionEntry<'projects'>[]> => {
  const projects = await getCollection('projects', ({ data }) => !isProd || !data.draft);
  return forLocale(projects, locale).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
};

/** Busca una entrada por su slug SIN prefijo de idioma (ej. "closets-a-medida"). */
export const findBySlug = <T extends { id: string }>(items: T[], slug: string): T | undefined =>
  items.find((item) => stripLocale(item.id) === slug);

/** Resuelve una lista de slugs (sin prefijo de idioma) contra entradas ya filtradas por idioma. */
export const byIds = <T extends { id: string }>(items: T[], slugs: string[]): T[] =>
  slugs
    .map((slug) => items.find((item) => stripLocale(item.id) === slug))
    .filter((item): item is T => Boolean(item));
