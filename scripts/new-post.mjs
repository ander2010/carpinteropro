#!/usr/bin/env node
// CLI interactivo para crear un nuevo artículo del blog.
// Uso: npm run new:post
import { createInterface } from 'node:readline/promises';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const blogDir = path.join(root, 'src/content/blog');

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = async (question, fallback = '') => {
  const answer = (
    await rl.question(fallback ? `${question} (${fallback}): ` : `${question}: `)
  ).trim();
  return answer || fallback;
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const VALID_TYPES = [
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
];

const VALID_CATEGORIES = [
  'carpinteria',
  'muebles-a-medida',
  'cocinas',
  'closets',
  'gabinetes',
  'madera',
  'diseno',
  'reparaciones',
  'consejos',
  'proyectos',
  'inspiracion',
];

async function main() {
  console.log('\n📝 Crear nuevo artículo — CarpinteroPro\n');

  const localeInput = await ask('Idioma del artículo [es, en]', 'es');
  const locale = localeInput === 'en' ? 'en' : 'es';
  const defaultAuthor = locale === 'es' ? 'Equipo CarpinteroPro' : 'CarpinteroPro Team';

  const title = await ask('Título del artículo');
  if (!title) {
    console.error('El título es obligatorio.');
    process.exit(1);
  }

  const defaultSlug = slugify(title);
  const slugInput = await ask('Slug', defaultSlug);
  const slug = slugify(slugInput);

  const description = await ask('Descripción (meta description, 1-2 frases)');
  const category = await ask(`Categoría [${VALID_CATEGORIES.join(', ')}]`, 'carpinteria');
  const type = await ask(`Tipo de artículo [${VALID_TYPES.join(', ')}]`, 'guide');
  const author = await ask('Autor', defaultAuthor);
  const tagsInput = await ask('Tags separados por coma (opcional)');
  const heroImage = await ask(
    'Ruta de imagen destacada (opcional, ej. /images/blog/mi-articulo/hero.jpg)',
  );
  const youtube = await ask('ID de vídeo de YouTube (opcional)');

  rl.close();

  const today = new Date().toISOString().split('T')[0];
  const folderName = `${today}-${slug}`;
  const targetDir = path.join(blogDir, locale, folderName);

  if (existsSync(targetDir)) {
    console.error(`\nYa existe una carpeta en ${targetDir}. Elige otro slug.`);
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });

  const tags = tagsInput
    ? tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const frontmatterLines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `publishDate: ${today}`,
    `author: "${author}"`,
    `category: "${category}"`,
    `type: "${type}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    'featured: false',
    'draft: true',
    ...(heroImage
      ? [`heroImage: "${heroImage}"`, `heroImageAlt: "${title.replace(/"/g, '\\"')}"`]
      : []),
    ...(youtube ? [`youtube: "${youtube}"`] : []),
    'relatedServices: []',
    'relatedProducts: []',
    'relatedPosts: []',
    '---',
    '',
    `import { EstimateCTA, FAQ } from '@components/mdx';`,
    '',
    locale === 'es' ? '## Introducción' : '## Introduction',
    '',
    locale === 'es'
      ? 'Escribe aquí la introducción del artículo...'
      : 'Write the article introduction here...',
    '',
    locale === 'es' ? '## Desarrollo' : '## Body',
    '',
    locale === 'es'
      ? 'Contenido principal del artículo. Puedes usar los componentes disponibles:'
      : 'Main article content. You can use the available components:',
    '',
    '```mdx',
    `<EstimateCTA${locale === 'en' ? ' locale="en"' : ''} context="${title.replace(/"/g, '\\"')}" />`,
    '```',
    '',
  ];

  const filePath = path.join(targetDir, 'index.mdx');
  writeFileSync(filePath, frontmatterLines.join('\n'), 'utf-8');

  console.log(`\n✅ Artículo creado en: src/content/blog/${locale}/${folderName}/index.mdx`);
  console.log(
    '   Recuerda cambiar "draft: true" a "draft: false" cuando esté listo para publicar.',
  );
  console.log('   Consulta CONTENT_GUIDE.md para más detalles.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
