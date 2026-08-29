import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://carpinteropro.com',
  output: 'static',
  trailingSlash: 'never',
  prefetch: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
        },
      },
      // Excluye del sitemap cualquier página marcada como contenido de
      // demostración (slugs terminados en "-demo", ver CONTENT_GUIDE.md) y
      // cualquier otra ruta que no deba indexarse.
      filter: (page) => !page.includes('-demo') && !page.includes('/thank-you'),
    }),
    mdx(),
  ],
  image: {
    domains: ['images.unsplash.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
