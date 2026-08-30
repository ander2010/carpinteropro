# CarpinteroPro

Sitio web de [CarpinteroPro](https://carpinteropro.com) construido con [Astro](https://astro.build), Tailwind CSS v4 y Content Collections. Orientado a SEO orgánico y captación de presupuestos para un negocio de carpintería y muebles a medida.

Sitio 100% estático (`output: 'static'`): se compila a HTML/CSS/JS y puede desplegarse en cualquier hosting, tradicional o moderno.

## Stack

- **[Astro 7](https://astro.build)** — framework principal, islas de interactividad mínimas.
- **Tailwind CSS v4** (`@tailwindcss/vite`) — estilos, con tokens de marca en `src/assets/styles/global.css`.
- **Content Collections + MDX** — blog, servicios, productos y proyectos, en español e inglés.
- **i18n propio** (`src/i18n/`) — español en la raíz (`/`), inglés bajo `/en/`. Ver sección "Idiomas" más abajo.
- **GSAP** — usado para un scroll-reveal sutil en los encabezados de sección (`src/assets/scripts/scrollReveal.ts`), respetando `prefers-reduced-motion`.
- **@astrojs/sitemap**, **RSS**, **Pagefind** — SEO técnico y búsqueda estática del blog (bilingüe).
- **Decap CMS** (`/admin`) — panel de edición de contenido opcional. Ver **CMS_SETUP.md**.
- **TypeScript estricto** en todo el proyecto.

## Requisitos

- Node.js 20 o superior.
- npm (el proyecto usa `package-lock.json`; puedes usar otro gestor si lo prefieres, adaptando los comandos).

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:4321`.

## Build de producción

```bash
npm run build
```

Esto ejecuta, en orden:

1. `astro check` — valida TypeScript y las plantillas `.astro`.
2. `astro build` — genera el sitio estático en `dist/`.
3. `pagefind --site dist` (postbuild) — genera el índice de búsqueda del blog en `dist/pagefind/`.

Previsualizar el build de producción localmente:

```bash
npm run preview
```

## Idiomas (Español / Inglés)

El sitio es bilingüe: **español en la raíz** (`/`, `/services`, `/blog/...`)
e **inglés bajo `/en/`** (`/en`, `/en/services`, `/en/blog/...`). No usa el
router de i18n de Astro para generar páginas automáticamente — cada página en
inglés es un archivo real dentro de `src/pages/en/**` que replica su
equivalente en español, para tener control total del contenido en cada
idioma.

- **Textos de interfaz** (menú, botones, formularios, etc.): un único
  diccionario en `src/i18n/ui.ts`. Cada componente compartido recibe un
  `locale` (`'es' | 'en'`) y llama a `useTranslations(locale)('clave')`.
- **Contenido** (blog, servicios, productos, proyectos): cada colección tiene
  subcarpetas `es/` y `en/` — ver `src/content/services/es/` y
  `src/content/services/en/`, etc. El idioma se infiere automáticamente del
  `id` de cada entrada (`es/mi-slug`, `en/mi-slug`); ver `src/i18n/utils.ts`
  (`stripLocale`, `withLocale`).
- **Selector de idioma**: `src/components/layout/LanguageSwitcher.astro`,
  visible en el header. Cambia de idioma manteniendo la misma página.
- **SEO**: cada página emite `<link rel="alternate" hreflang="es|en">` y
  `x-default` automáticamente (`src/components/seo/SEO.astro`).

### Cómo mantener el selector de idioma funcionando correctamente

Cuando una pieza de contenido existe en ambos idiomas, **debe usar el mismo
slug/nombre de archivo** en `es/` y `en/` (ej.
`services/es/closets-a-medida.md` y `services/en/closets-a-medida.md`). El
selector de idioma simplemente reemplaza el prefijo `/en/` en la URL actual,
así que si los slugs no coinciden, el visitante llega a una página
inexistente al cambiar de idioma.

### Añadir un idioma nuevo (ej. francés)

No es un proceso de un solo paso — implica: añadir el locale a
`src/i18n/ui.ts` (`locales`, diccionario completo), a `astro.config.mjs`
(`i18n.locales`), duplicar `src/pages/**` en `src/pages/fr/**`, y traducir el
contenido a `es/`/`en/`/`fr/` en cada colección. English/Español ya están
completos como referencia del patrón a seguir.

## Estructura del proyecto

```
src/
  assets/            estilos globales y scripts compartidos
  components/
    blog/            tarjetas, TOC, compartir, búsqueda
    conversion/      QuoteForm, WhatsAppCTA, CallCTA, barra móvil
    home/            secciones de la home
    layout/          Header, Footer, logo
    mdx/             componentes disponibles dentro de artículos MDX
    products/        products/ ServiceCard/ProductCard/ProjectCard
    projects/
    services/
    seo/             SEO.astro, JsonLd.astro, Analytics.astro
    ui/               Button, Badge, Breadcrumbs, Pagination, BeforeAfter...
  config/
    business.ts       ← DATOS REALES DE LA EMPRESA (edítalo primero)
    site.ts            nombre de marca, categorías de blog (es/en)
    navigation.ts       menú principal y del footer (locale-aware)
    seo.ts              plantillas de <title>, helpers de URL
  i18n/
    ui.ts               diccionario de textos de interfaz (es/en)
    utils.ts             useTranslations, getLocalizedPath, stripLocale...
  content/
    blog/es/ blog/en/    artículos (Content Collections + MDX), por idioma
    services/es/ services/en/
    products/es/ products/en/
    projects/es/ projects/en/
  content.config.ts    esquemas Zod de todas las colecciones
  data/
    locations.ts        ciudades para /locations/[slug] (vacío por defecto)
    testimonials.ts      testimonios reales (vacío por defecto)
  layouts/
    MainLayout.astro     layout base (head, header, footer, JSON-LD sitewide)
  pages/                 rutas en español (raíz)
  pages/en/               rutas en inglés (mismo árbol, duplicado)
  utils/                 helpers (fechas, JSON-LD, contenido, eventos)
scripts/
  new-post.mjs           CLI: npm run new:post
  generate-icons.mjs      genera favicons/OG image a partir del logo
public/
  admin/                 panel Decap CMS (index.html + config.yml)
  images/                imágenes servidas por ruta (placeholders incluidos)
  icons/, manifest.webmanifest, robots.txt (generado), etc.
```

## Configuración de la empresa (obligatorio antes de producción)

**Todo** dato real de la empresa se edita en un único archivo:

```
src/config/business.ts
```

Incluye teléfono, WhatsApp, email, dirección, horarios, áreas de servicio, redes
sociales, Google Business Profile, años de experiencia, valoraciones y
licencias. Cada campo vacío se **oculta automáticamente** en el sitio (header,
footer, WhatsApp CTA, Schema.org, etc.) — no hace falta tocar ningún
componente.

Consulta la lista completa de datos pendientes al final de este documento.

## Cómo cambiar cosas comunes

### Teléfono y WhatsApp

Edita `phone`, `phoneDisplay` y `whatsapp` en `src/config/business.ts`. El
número de WhatsApp va sin "+" ni espacios (formato internacional, ej.
`"13051234567"`).

### Logo

1. Coloca tu logo real en `public/images/brand/logo.svg` (preferido) y
   `public/images/brand/logo-inverse.svg` (versión clara para el footer
   oscuro), respetando las proporciones originales.
2. Vuelve a generar favicons/OG image:
   ```bash
   node scripts/generate-icons.mjs
   ```
   Este script usa `public/images/brand/mark.svg` (el símbolo/ícono, sin el
   texto) para generar `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`,
   `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png` y
   `og-default.png`. Sustituye también `mark.svg` si tu ícono cambia.

Actualmente el logo es un **placeholder funcional** (símbolo geométrico +
texto), no un logo de marca definitivo. Sustitúyelo antes de producción.

### Áreas de servicio (ciudades)

Añade ciudades reales al array `serviceAreas` en `src/config/business.ts`. Se
muestran automáticamente en el footer y en la sección "Áreas donde trabajamos"
de la home. Para crear además una página SEO dedicada a una ciudad
(`/locations/[slug]`), añade una entrada en `src/data/locations.ts` — pero
sólo si tienes contenido único y real para esa ciudad (ver comentarios en ese
archivo).

### Crear un Service

Crea un archivo en `src/content/services/es/mi-servicio.md` (o `en/` para la
versión en inglés) con el frontmatter definido en `src/content.config.ts`
(colección `services`). Usa uno existente como plantilla, por ejemplo
`src/content/services/es/closets-a-medida.md`. Si creas ambas versiones,
usa el **mismo nombre de archivo** en `es/` y `en/` (ver sección "Idiomas").

También puedes crear/editar servicios desde el panel `/admin` (ver
CMS_SETUP.md) sin tocar archivos directamente.

### Crear un Product

Igual que Service, pero en `src/content/products/es/` o `.../en/`. Usa
`src/content/products/es/closets-walk-in.md` como referencia.

### Crear un Project (portfolio)

Crea un archivo en `src/content/projects/es/` o `.../en/`. Marca
`demo: true` únicamente en proyectos de ejemplo (se excluyen del sitemap y
se marcan `noindex` automáticamente). Usa
`src/content/projects/es/closet-walk-in-demo.md` como referencia de
estructura.

### Crear un artículo de Blog

```bash
npm run new:post
```

Sigue el asistente interactivo (crea el artículo en español, dentro de
`src/content/blog/es/`). Para la versión en inglés, crea manualmente el
archivo equivalente en `src/content/blog/en/` o usa el panel `/admin`. Ver
**CONTENT_GUIDE.md** para el detalle completo, incluyendo cómo usar
imágenes, YouTube, MP4, galerías y antes/después.

### Añadir imágenes

Coloca los archivos en `public/images/...` (por ejemplo
`public/images/blog/mi-articulo/hero.jpg`) y referencia esa misma ruta en el
frontmatter (`heroImage: "/images/blog/mi-articulo/hero.jpg"`). El proyecto no
usa el pipeline de assets de Astro para las imágenes de contenido —así puedes
añadir imágenes sin recompilar tipos— pero sí recibe optimización básica
(lazy loading, `decoding="async"`, contenedores con `aspect-ratio` para evitar
CLS). Ver sección "Imágenes" en CONTENT_GUIDE.md para recomendaciones de
formato (WebP/AVIF) y nombres de archivo.

### Añadir YouTube / vídeo MP4 / Galería / Antes-después

Estos son componentes MDX disponibles dentro de cualquier artículo o (para
Service/Product) en el cuerpo del contenido. Ver **CONTENT_GUIDE.md**.

### Cambiar SEO (title, description, OG)

- Valores por defecto: `src/config/seo.ts` y `src/config/site.ts`.
- Por página/artículo: campos `seoTitle`, `seoDescription`, `canonical`,
  `ogImage` en el frontmatter de cada colección.
- Componente central: `src/components/seo/SEO.astro`.

## Analítica (opcional)

Copia `.env.example` a `.env` y completa `PUBLIC_GA_ID` y/o `PUBLIC_GTM_ID`
para activar Google Analytics 4 / Google Tag Manager. Si se dejan vacíos, no
se carga ningún script de analítica.

## Formulario de presupuesto

`src/components/conversion/QuoteForm.astro` es el formulario reutilizable
(Home, Services, Products, Blog, Contact). Su comportamiento de envío:

1. Si `PUBLIC_CONTACT_ENDPOINT` está definido en `.env`, envía los datos
   (incluidas fotos) como `FormData` a ese endpoint. Por defecto apunta a
   `public/contact.php`, incluido en el repo: un script PHP sin dependencias
   que envía por email el resumen completo con las fotos adjuntas a
   `info@carpinteropro.com` (funciona en cualquier hosting cPanel/compartido
   con `mail()` habilitado). También puede apuntarse a un servicio externo
   (Formspree, Web3Forms, Getform, un webhook propio, etc.).
2. Si no hay endpoint pero sí WhatsApp configurado, abre WhatsApp con un
   resumen de la solicitud.
3. Si tampoco hay WhatsApp pero sí email, abre un `mailto:` prellenado (sin
   adjuntos: `mailto:` no puede enviar archivos).
4. Si no hay ningún canal configurado, se lo indica al visitante (estado
   previo al lanzamiento).

El método de contacto preferido (WhatsApp/Llamada/Email) admite selección
múltiple (checkboxes), no una sola opción.

Ver `.env.example` y `DEPLOYMENT.md` (sección "Formulario de contacto") para
más detalle.

## Documentación relacionada

- **CONTENT_GUIDE.md** — cómo publicar contenido (blog, imágenes, vídeo, etc.).
- **CMS_SETUP.md** — cómo activar el panel de edición `/admin` (Decap CMS).
- **SEO_SETUP.md** — checklist técnico de SEO (Search Console, GA4, sitemap...).
- **SEO_CHECKLIST.md** — checklist a repasar en cada artículo antes de publicar.
- **DEPLOYMENT.md** — cómo desplegar `dist/` en hosting estático, Vercel o Netlify.
- **POST_DEPLOYMENT.md** — pasos posteriores al lanzamiento (indexación, dominio, etc.).

## Información real pendiente antes de producción

Este proyecto no incluye ningún dato inventado. Antes de lanzar a producción,
completa lo siguiente:

| Dato                                          | Dónde se configura                                                                                                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Teléfono y WhatsApp                           | `src/config/business.ts` (`phone`, `phoneDisplay`, `whatsapp`)                                                                                                |
| Email de contacto                             | `src/config/business.ts` (`email`)                                                                                                                            |
| Dirección (si aplica)                         | `src/config/business.ts` (`address`, `geo`)                                                                                                                   |
| Horarios                                      | `src/config/business.ts` (`openingHours`)                                                                                                                     |
| Ciudades / áreas de servicio                  | `src/config/business.ts` (`serviceAreas`)                                                                                                                     |
| Redes sociales                                | `src/config/business.ts` (`social`)                                                                                                                           |
| Google Business Profile                       | `src/config/business.ts` (`googleBusinessProfileUrl`)                                                                                                         |
| Años de experiencia / proyectos realizados    | `src/config/business.ts` (`yearsOfExperience`, `projectsCompleted`) — se omiten si quedan en `null`                                                           |
| Valoraciones (rating real)                    | `src/config/business.ts` (`rating`)                                                                                                                           |
| Licencias                                     | `src/config/business.ts` (`licenses`)                                                                                                                         |
| Logo definitivo                               | `public/images/brand/logo.svg`, `logo-inverse.svg`, `mark.svg` + `node scripts/generate-icons.mjs`                                                            |
| Fotos reales de proyectos/productos/servicios | Sustituir las rutas `heroImage`/`gallery` en `src/content/**` (actualmente apuntan a `public/images/placeholders/*.svg`, claramente marcadas como referencia) |
| Testimonios reales                            | `src/data/testimonials.ts` (vacío por defecto)                                                                                                                |
| Servicios y productos reales                  | Revisar/editar `src/content/services/` y `src/content/products/` — los incluidos son un punto de partida realista, no una lista cerrada                       |
| Proyectos reales del portfolio                | Sustituir los dos proyectos `demo: true` en `src/content/projects/` por casos reales (o eliminarlos)                                                          |
| Endpoint del formulario de contacto           | `.env` → `PUBLIC_CONTACT_ENDPOINT` (por defecto `/contact.php`, incluido en `public/`)                                                                        |
| IDs de analítica (opcional)                   | `.env` → `PUBLIC_GA_ID` / `PUBLIC_GTM_ID`                                                                                                                     |
| Dominio de producción                         | Ya configurado como `https://carpinteropro.com` en `astro.config.mjs` y `src/config/business.ts` — actualízalo si cambia                                      |
