# Guía de contenido — CarpinteroPro

Guía práctica para publicar contenido sin tocar código. Pensada para poder
publicar un artículo de blog al día.

## Idiomas: español e inglés

Todo el contenido (blog, servicios, productos, proyectos) vive en dos
subcarpetas por colección: `es/` y `en/` (ej. `src/content/blog/es/` y
`src/content/blog/en/`). No hace falta traducir cada pieza al momento de
crearla — puedes publicar sólo en español y añadir la versión en inglés más
adelante.

**Importante:** si vas a tener la misma pieza en ambos idiomas, usa el
**mismo slug/nombre de archivo** en `es/` y `en/` (ej.
`services/es/cocinas-a-medida.md` ↔ `services/en/cocinas-a-medida.md`). El
selector de idioma del sitio construye la URL del otro idioma reemplazando
sólo el prefijo `/en/`, así que slugs distintos rompen ese cambio de idioma.

## Panel de edición (CMS)

Todo lo de esta guía también puede hacerse desde un formulario web en
`/admin` (sin tocar archivos ni Markdown) una vez configurado — ver
**CMS_SETUP.md**. Es opcional; el flujo manual descrito abajo sigue
funcionando igual, con o sin el panel activado.

## Crear un artículo de blog

```bash
npm run new:post
```

El asistente pregunta primero el idioma (`es` o `en`), y luego título, slug,
descripción, categoría, tipo de artículo, autor, tags, imagen destacada y
(opcional) ID de YouTube. Crea:

```
src/content/blog/es/YYYY-MM-DD-tu-slug/index.mdx   (o blog/en/... si elegiste inglés)
```

con `draft: true` por defecto. Escribe el contenido y cuando esté listo,
cambia `draft: false` en el frontmatter.

También puedes crear el archivo a mano copiando la estructura de un artículo
existente en `src/content/blog/`.

## Tipos de artículo (`type`)

El frontmatter incluye un campo `type`, usado sólo para organización interna
(no cambia el layout automáticamente, pero ayuda a planificar el contenido):

| type          | Uso                                     |
| ------------- | --------------------------------------- |
| `guide`       | Guías educativas / pilares de contenido |
| `howto`       | Tutoriales paso a paso                  |
| `project`     | Explicación de un proyecto              |
| `beforeafter` | Antes y después                         |
| `video`       | Artículo centrado en un vídeo           |
| `gallery`     | Galería de trabajos                     |
| `faq`         | Preguntas y respuestas                  |
| `comparison`  | Comparativas (ej. material A vs. B)     |
| `inspiration` | Ideas de diseño                         |
| `news`        | Novedades                               |
| `casestudy`   | Caso real detallado                     |

## Frontmatter disponible

Ver el esquema completo (validado con Zod) en `src/content.config.ts`,
colección `blog`. Campos más usados:

```yaml
title: 'Título del artículo'
description: 'Meta description, 1-2 frases'
publishDate: 2026-08-20
updatedDate: 2026-09-01 # opcional
author: 'Equipo CarpinteroPro'
category: 'closets' # ver src/config/site.ts → blogCategories
type: 'guide'
tags: ['closets', 'muebles a medida']
featured: false
draft: false
heroImage: '/images/blog/mi-articulo/hero.jpg'
heroImageAlt: 'Descripción de la imagen'
relatedServices: ['closets-a-medida'] # slugs de src/content/services
relatedProducts: ['closets-walk-in'] # slugs de src/content/products
relatedPosts: ['otro-articulo-slug']
seoTitle: 'Título SEO completo | CarpinteroPro'
seoDescription: 'Meta description SEO específica'
```

`category` debe ser uno de los slugs definidos en `blogCategories` dentro de
`src/config/site.ts` (así se generan automáticamente las páginas
`/blog/category/[slug]`).

## Componentes disponibles dentro de un artículo (MDX)

**Nota para artículos en inglés:** varios componentes (`FAQ`, `Callout`,
`EstimateCTA`, `ServiceCard`, `ProductCard`, `ProjectGallery`, `BeforeAfter`,
`YouTube`, `Video`) aceptan una prop `locale="en"` para que sus textos por
defecto y los enlaces internos que generan salgan en inglés y apunten a
`/en/...`. Si no la pasas, asumen español. Ya está incluida en los ejemplos
de `src/content/blog/en/*/index.mdx`.

Impórtalos al inicio del archivo `.mdx`:

```mdx
import {
  YouTube,
  Video,
  Gallery,
  BeforeAfter,
  Callout,
  QuoteCTA,
  EstimateCTA,
  ServiceCard,
  ProductCard,
  ProjectGallery,
  FAQ,
  ComparisonTable,
  ImageWithCaption,
} from '@components/mdx';
```

### Vídeo de YouTube

```mdx
<YouTube id="dQw4w9WgXcQ" title="Cómo medir un espacio para closet" />
```

Se renderiza como miniatura ligera (facade); el iframe sólo se carga al hacer
clic, para no afectar el rendimiento.

### Vídeo local (MP4/WebM)

```mdx
<Video
  src="/videos/mi-video.mp4"
  poster="/images/blog/mi-articulo/poster.jpg"
  title="Título del vídeo"
/>
```

### Galería de imágenes

```mdx
<Gallery
  columns={3}
  images={[
    { src: '/images/blog/mi-articulo/foto-1.jpg', alt: 'Descripción', caption: 'Opcional' },
    { src: '/images/blog/mi-articulo/foto-2.jpg', alt: 'Descripción' },
  ]}
/>
```

### Antes / después

```mdx
<BeforeAfter
  before="/images/.../antes.jpg"
  after="/images/.../despues.jpg"
  beforeAlt="Antes"
  afterAlt="Después"
/>
```

### Galería de un proyecto del portfolio

```mdx
<ProjectGallery slug="mi-proyecto-slug" />
```

Muestra automáticamente la galería del proyecto (`src/content/projects/`) y
un enlace a su ficha completa.

### Nota / consejo / advertencia

```mdx
<Callout type="tip" title="Consejo">
  Texto del consejo.
</Callout>
```

`type` acepta `info`, `tip` o `warning`.

### CTA de presupuesto (compacto)

```mdx
<QuoteCTA context="Closet a medida" />
```

### CTA con formulario completo embebido

```mdx
<EstimateCTA context="Closet a medida" title="Solicita tu presupuesto" />
```

### Tarjeta de servicio/producto relacionado

```mdx
<ServiceCard slug="closets-a-medida" />
<ProductCard slug="closets-walk-in" />
```

### Preguntas frecuentes (con JSON-LD FAQPage automático)

```mdx
<FAQ items={[{ question: '¿Pregunta?', answer: 'Respuesta.' }]} />
```

### Tabla comparativa

```mdx
<ComparisonTable headers={['Aspecto', 'Opción A', 'Opción B']} rows={[['Costo', 'Bajo', 'Alto']]} />
```

### Imagen con leyenda

```mdx
<ImageWithCaption src="/images/..." alt="..." caption="Texto de la leyenda" />
```

## Imágenes

- Colócalas en `public/images/<sección>/<slug>/archivo.jpg` (ej.
  `public/images/blog/guia-closets/hero.jpg`).
- Usa nombres descriptivos: `closet-nogal-walk-in.jpg`, no `IMG_4821.jpg`.
- Formatos preferidos: **WebP** o **AVIF** para fotos; **SVG** para íconos o
  ilustraciones.
- Escribe siempre un `alt` descriptivo real (no lo dejes vacío ni genérico).
- Mientras no tengas fotos reales, usa los placeholders existentes en
  `public/images/placeholders/` (claramente marcados como "Imagen de
  referencia" para no atribuir fotografía de stock como propia). Sustitúyelos
  por fotos reales en cuanto estén disponibles.

## Publicar

```bash
npm run build
```

Corrige cualquier error de `astro check` antes de dar el contenido por
publicado. Revisa la página en `npm run dev` o `npm run preview` antes de
subir a producción.

## Contenido de ejemplo (DEMO) incluido en el proyecto

Este proyecto incluye contenido de ejemplo para que puedas ver todos los
componentes en funcionamiento:

- 6 servicios y 6 productos con contenido genérico razonable (no inventado
  como "hechos", sino como descripciones de servicio típicas de carpintería).
- 2 proyectos de portfolio marcados con `demo: true` (slugs terminados en
  `-demo`). Estos se excluyen automáticamente del sitemap y llevan
  `noindex` hasta que los reemplaces por proyectos reales o los elimines.
- 6 artículos de blog que ilustran los distintos `type` y componentes MDX.

Antes de producción: revisa los servicios/productos (ajústalos a lo que
realmente ofrece el negocio) y reemplaza o elimina los proyectos demo.
