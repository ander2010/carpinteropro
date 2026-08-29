import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedBlogPosts } from '@utils/content';
import { site, defaultDescriptionFor } from '@config/site';
import { getLocalizedPath, stripLocale } from '@i18n/utils';

const locale = 'es' as const;

export async function GET(context: APIContext) {
  const posts = await getPublishedBlogPosts(locale);

  return rss({
    title: `Blog de ${site.brandName}`,
    description: defaultDescriptionFor[locale],
    site: context.site ?? 'https://carpinteropro.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: getLocalizedPath(locale, `/blog/${stripLocale(post.id)}`),
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
    })),
    customData: `<language>es</language>`,
  });
}
