# Deployment — CarpinteroPro

El sitio es completamente estático (`output: 'static'` en `astro.config.mjs`):
no depende de un servidor Node en producción. Se puede desplegar el contenido
de `dist/` en cualquier hosting, incluyendo hosting tradicional (cPanel, FTP,
etc.), sin necesidad de plataformas específicas.

## 1. Generar el build

```bash
npm install
npm run build
```

Esto genera la carpeta `dist/` con HTML, CSS, JS, imágenes y el índice de
búsqueda de Pagefind (`dist/pagefind/`).

Verifica el build localmente antes de subirlo:

```bash
npm run preview
```

## 2. Hosting tradicional (cPanel, FTP, Apache/Nginx, etc.)

1. Sube **el contenido de `dist/`** (no la carpeta `dist/` en sí, sino los
   archivos que hay dentro) a la raíz pública del hosting (normalmente
   `public_html/` o `www/`).
2. Asegúrate de que el servidor sirva `index.html` como documento por defecto
   y `404.html` como página de error 404 (la mayoría de hostings cPanel lo
   detectan automáticamente si el archivo se llama `404.html`; en Apache
   puedes forzarlo con `ErrorDocument 404 /404.html` en `.htaccess`).
3. Verifica que las URLs sin barra final funcionen correctamente (el proyecto
   usa `trailingSlash: 'never'`); la mayoría de servidores estáticos lo
   manejan sin configuración adicional al servir `carpeta/index.html` para
   `/carpeta`.
4. Configura HTTPS (Let's Encrypt vía tu proveedor, o el certificado que
   ofrezca el hosting) y fuerza la redirección HTTP → HTTPS.
5. Configura la redirección de `www.carpinteropro.com` hacia
   `carpinteropro.com` (o viceversa, pero mantén consistencia con el dominio
   canónico configurado en `astro.config.mjs` y `src/config/business.ts`).

## 3. Vercel (alternativa)

El proyecto **no depende** de Vercel, pero funciona sin configuración
adicional:

1. Importa el repositorio en Vercel.
2. Framework preset: **Astro** (detectado automáticamente).
3. Build command: `npm run build`. Output directory: `dist`.
4. Añade las variables de entorno de `.env.example` que necesites
   (`PUBLIC_CONTACT_ENDPOINT`, `PUBLIC_GA_ID`, `PUBLIC_GTM_ID`) en el panel de
   Environment Variables.

## 4. Netlify (alternativa)

1. Importa el repositorio en Netlify.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Añade las mismas variables de entorno que en Vercel.
4. Netlify sirve automáticamente `404.html` para rutas no encontradas.

## 5. Variables de entorno

Copia `.env.example` a `.env` (local) o configúralas en el panel del hosting
elegido:

```
PUBLIC_CONTACT_ENDPOINT=
PUBLIC_GA_ID=
PUBLIC_GTM_ID=
```

Ninguna es obligatoria para que el sitio compile y funcione: si faltan, el
formulario usa el fallback de WhatsApp/email y no se carga analítica (ver
README).

## 6. Después de desplegar

Continúa con **POST_DEPLOYMENT.md** para la configuración de Search Console,
GA4, dominio y redirecciones.
