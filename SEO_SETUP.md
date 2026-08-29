# SEO Setup — CarpinteroPro

Checklist técnico para dejar el sitio correctamente indexado y medido tras el
despliegue. El código no puede realizar estos pasos automáticamente (requieren
acceso a cuentas externas), pero deja todo preparado para ejecutarlos.

## 1. Google Search Console

1. Entra a [search.google.com/search-console](https://search.google.com/search-console).
2. Añade una propiedad de **dominio** (`carpinteropro.com`) — verificación
   recomendada vía registro DNS TXT con tu proveedor de dominio.
3. Una vez verificado, ve a **Sitemaps** y envía:
   ```
   https://carpinteropro.com/sitemap-index.xml
   ```
   (verifica el nombre exacto del sitemap tras el build — ver sección 4).
4. Usa **Inspección de URLs** para solicitar indexación manual de:
   - `/` (home)
   - `/services` y cada `/services/[slug]` publicado
   - `/products`
   - `/contact`

## 2. Google Business Profile

1. Crea o reclama la ficha en [business.google.com](https://business.google.com).
2. Usa exactamente el mismo **nombre, dirección y teléfono (NAP)** que
   configures en `src/config/business.ts`, para mantener consistencia NAP.
3. Añade categoría de negocio (ej. "Carpintero", "Ebanista"), horario, fotos
   reales y área de servicio.
4. Copia la URL de la ficha en `googleBusinessProfileUrl` dentro de
   `src/config/business.ts`.
5. Enlaza la ficha desde `social.googleBusiness` si quieres mostrarla en el
   footer.

## 3. Google Analytics 4 (opcional)

1. Crea una propiedad GA4 en [analytics.google.com](https://analytics.google.com).
2. Copia el **Measurement ID** (`G-XXXXXXXXXX`).
3. Añádelo a `.env` como `PUBLIC_GA_ID`.
4. Vuelve a compilar y desplegar. GA4 sólo se carga si esta variable existe.

Si usas Google Tag Manager en su lugar, usa `PUBLIC_GTM_ID` (no configures
ambos a la vez; si `PUBLIC_GTM_ID` existe, tiene prioridad).

## 4. Sitemap

Generado automáticamente por `@astrojs/sitemap` en el build. Tras ejecutar
`npm run build`, revisa el nombre real del archivo en `dist/`:

```bash
ls dist/sitemap*
```

Normalmente será `sitemap-index.xml` (que referencia `sitemap-0.xml`, etc.).
`src/pages/robots.txt.ts` ya apunta a `sitemap-index.xml` automáticamente —
si el nombre generado difiere, ajústalo ahí.

Las páginas de proyectos marcadas `demo: true` se excluyen automáticamente
del sitemap (ver `astro.config.mjs`, filtro de slugs terminados en `-demo`).

## 5. Bing Webmaster Tools

1. Entra a [bing.com/webmasters](https://www.bing.com/webmasters).
2. Puedes importar la propiedad directamente desde Google Search Console
   (opción "Import from Google Search Console") o verificarla manualmente.
3. Envía el mismo sitemap: `https://carpinteropro.com/sitemap-index.xml`.

## 6. Rich Results Test

Antes y después de publicar contenido nuevo con datos estructurados (FAQ,
artículos, servicios), valida con:

- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

Prueba especialmente:

- Home (`Organization`, `WebSite`, `LocalBusiness`/`HomeAndConstructionBusiness`)
- Un artículo de blog (`BlogPosting`, `BreadcrumbList`)
- Una página de servicio (`Service`, `BreadcrumbList`)
- Un artículo con `<FAQ />` (`FAQPage`)

## 7. PageSpeed Insights / Core Web Vitals

Ejecuta [pagespeed.web.dev](https://pagespeed.web.dev) contra la URL de
producción (no localhost) para Mobile y Desktop, en Home y en al menos una
página de Service/Product/Blog. Objetivo: Performance, SEO, Accessibility y
Best Practices ≥ 95 (ver README, sección de performance).

## 8. robots.txt

Generado dinámicamente en `src/pages/robots.txt.ts`. En producción emite:

```
User-agent: *
Allow: /

Sitemap: https://carpinteropro.com/sitemap-index.xml
```

Si despliegas primero a un entorno de staging, añade una variable de entorno
o config para servir `Disallow: /` allí — actualmente el archivo asume
siempre producción/indexable. No lo dejes así en un dominio de staging
público.

## 9. Dominio canónico, SSL y redirecciones

El dominio canónico configurado es `https://carpinteropro.com` (sin `www`).
Ver `POST_DEPLOYMENT.md` para la configuración de redirecciones HTTP→HTTPS y
`www`→sin-`www` (o viceversa) a nivel de hosting/DNS.

## 10. Publicación de contenido y autoridad temática

- Publica servicios y productos primero (son las páginas de mayor intención
  comercial).
- Luego blog, agrupando artículos por categoría (`src/config/site.ts`,
  `blogCategories`) para construir topical authority.
- Usa `relatedServices` / `relatedProducts` / `relatedPosts` en cada artículo
  para reforzar el enlazado interno hacia páginas de conversión.
- Revisa Search Console periódicamente (Rendimiento → Consultas) para
  detectar qué está funcionando y ampliar esos temas.
