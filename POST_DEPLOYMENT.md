# Post-Deployment — CarpinteroPro

Pasos a seguir inmediatamente después del primer despliegue a producción.

## 1. Dominio y SSL

- [ ] Dominio canónico funcionando: `https://carpinteropro.com`
- [ ] `http://carpinteropro.com` redirige a `https://carpinteropro.com`
- [ ] `https://www.carpinteropro.com` redirige a `https://carpinteropro.com`
- [ ] `http://www.carpinteropro.com` redirige a `https://carpinteropro.com`
- [ ] Certificado SSL válido y sin advertencias del navegador

(Si decides usar `www` como dominio canónico en su lugar, invierte las
redirecciones anteriores y actualiza `site` en `astro.config.mjs` y `domain`
en `src/config/business.ts` antes de desplegar.)

## 2. Verificación e indexación

- [ ] Propiedad verificada en Google Search Console
- [ ] Sitemap enviado (`/sitemap-index.xml`)
- [ ] Home indexada manualmente (Inspección de URLs → Solicitar indexación)
- [ ] Páginas principales de `/services/*` indexadas manualmente
- [ ] Propiedad verificada en Bing Webmaster Tools + sitemap enviado

## 3. Analítica

- [ ] GA4 (`PUBLIC_GA_ID`) o GTM (`PUBLIC_GTM_ID`) configurado, si aplica
- [ ] Confirmar en el panel de GA4 (Informes en tiempo real) que llegan
      visitas tras navegar el sitio en producción

## 4. Rich Results / Schema

- [ ] Home validada en [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Una página de servicio validada
- [ ] Un artículo de blog validado

## 5. PageSpeed / Core Web Vitals

- [ ] Home ≥ 95 en Performance/SEO/Accessibility/Best Practices (Mobile y
      Desktop) en [pagespeed.web.dev](https://pagespeed.web.dev)
- [ ] Revisar LCP, CLS e INP específicamente en la home (hero con imagen) y en
      una página de artículo largo

## 6. Formulario de contacto

- [ ] `PUBLIC_CONTACT_ENDPOINT` configurado y probado con un envío real
- [ ] Confirmar que las notificaciones del endpoint (email, panel del
      proveedor, etc.) llegan correctamente
- [ ] Si no se configuró un endpoint, confirmar que el fallback de
      WhatsApp/email funciona como se espera

## 7. Contenido pendiente de revisión

- [ ] Sustituidos o eliminados los proyectos `demo: true` en
      `src/content/projects/`
- [ ] Revisados los servicios/productos de ejemplo (ajustados a la oferta real)
- [ ] Testimonios reales añadidos (si existen) en `src/data/testimonials.ts`
- [ ] Logo definitivo colocado y favicons regenerados
      (`node scripts/generate-icons.mjs`)
- [ ] Fotografía real sustituyendo los placeholders en `public/images/`

## 8. Publicación continua

- [ ] Calendario/rutina definida para publicar contenido de blog con
      regularidad (ver README y CONTENT_GUIDE.md)
- [ ] Revisar semanalmente Search Console → Rendimiento para detectar
      consultas con impresiones pero sin clics (oportunidad de mejorar
      title/description) y consultas nuevas para ampliar contenido
