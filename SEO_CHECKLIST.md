# SEO Checklist — por artículo/página

Repasa esta lista antes de marcar `draft: false` en un artículo, servicio o
producto.

## Contenido

- [ ] Keyword/intención de búsqueda clara y definida antes de escribir
- [ ] Título (`title`) único, no duplicado en el sitio
- [ ] Un único `<h1>` en la página (lo gestiona el layout automáticamente a
      partir de `title`)
- [ ] Meta `description` (o `seoDescription`) única, no genérica, 120-160
      caracteres aprox.
- [ ] Contenido útil y original (nada copiado, nada generado en bloque sin
      revisión humana)
- [ ] Sin keyword stuffing ni texto oculto

## Imágenes

- [ ] Imagen destacada (`heroImage`) presente y con `heroImageAlt` descriptivo
- [ ] Nombres de archivo descriptivos (no `IMG_1234.jpg`)
- [ ] Imágenes reales (no placeholders) antes de publicar en producción final

## Enlazado interno

- [ ] Al menos un servicio relacionado (`relatedServices`) cuando aplique
- [ ] Al menos un producto o proyecto relacionado cuando aplique
- [ ] CTA de presupuesto presente (`<QuoteCTA />` o `<EstimateCTA />` en
      artículos; ya incluido por defecto en Service/Product/Project)

## Metadatos

- [ ] `author` correcto (blog)
- [ ] `publishDate` correcto; `updatedDate` si el artículo se revisó
- [ ] `category` válida (una de `blogCategories` en `src/config/site.ts`)
- [ ] `seoTitle`/`seoDescription` sólo si necesitas un override distinto al
      título/descripción visibles
- [ ] `canonical` sólo si la página vive también en otra URL (evitar duplicar
      contenido)

## Datos estructurados

- [ ] Si el artículo usa `<FAQ />`, revisar que las preguntas/respuestas sean
      reales y útiles (se genera `FAQPage` automáticamente)
- [ ] Validado en [Rich Results Test](https://search.google.com/test/rich-results)
      tras publicar (ver SEO_SETUP.md)

## Revisión final

- [ ] Revisado en móvil (320–430px) y desktop
- [ ] Revisada la ortografía y gramática
- [ ] `npm run build` sin errores
- [ ] Enlaces probados (ningún `href="#"` suelto, ningún 404 interno)
