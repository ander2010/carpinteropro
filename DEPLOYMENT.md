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

## 3. Formulario de contacto (envío real de email con adjuntos)

El formulario de presupuesto (`QuoteForm`) necesita un `PUBLIC_CONTACT_ENDPOINT`
configurado para poder enviar un email de verdad (con las fotos adjuntas) a
`info@carpinteropro.com` cuando alguien pulsa "Enviar solicitud". Sin ese
endpoint, el formulario solo abre WhatsApp o un `mailto:` prellenado (el
`mailto:` **no puede** adjuntar archivos ni enviar nada automáticamente: solo
abre el cliente de correo del visitante).

Para hosting cPanel/FTP tradicional (el caso más común de este proyecto), el
repositorio ya incluye `public/contact.php`, que recibe el formulario y envía
el email con los adjuntos por **SMTP autenticado** usando
[PHPMailer](https://github.com/PHPMailer/PHPMailer) (código incluido en
`public/lib/phpmailer/`, sin Composer). Usa SMTP y no la función `mail()` de
PHP a propósito: `mail()` "acepta" el envío (devuelve `true`) pero en hosting
compartido (Hostinger incluido — está documentado por ellos mismos) el correo
casi nunca llega, porque sale sin autenticación SPF/DKIM y el servidor de
destino lo descarta o lo manda a spam. Pasos:

1. Crea un buzón de correo real en tu hosting (en Hostinger: **hPanel →
   Emails → Administrar → Crear cuenta de correo**), por ejemplo
   `info@carpinteropro.com`.
2. Copia `public/mail-config.example.php` a `public/mail-config.php` (mismo
   directorio) y completa los datos reales: host SMTP, usuario (el buzón que
   acabas de crear) y contraseña (**la del buzón, no la de tu cuenta de
   Hostinger/hPanel**). Ver ese archivo para el detalle de puertos/cifrado.
   `mail-config.php` está en `.gitignore` — nunca se sube a git, solo por
   FTP/hPanel, para no exponer la contraseña en el repositorio (que es
   público).
3. En el `.env` usado para compilar el sitio, define:
   ```
   PUBLIC_CONTACT_ENDPOINT=/contact.php
   ```
4. `npm run build` — `contact.php`, `mail-config.php` y `lib/phpmailer/` se
   copian automáticamente a `dist/` (viven en `public/`, que Astro copia tal
   cual).
5. Sube el contenido de `dist/` como siempre; `contact.php` quedará
   accesible en `https://carpinteropro.com/contact.php`.
6. Haz un envío de prueba real desde el formulario en producción y confirma
   que llega a `info@carpinteropro.com` (revisa también la carpeta de spam).

Notas:

- El destinatario (`info@carpinteropro.com`) está definido como constante al
  inicio de `public/contact.php`; edítalo ahí si cambia. El remitente es el
  buzón SMTP configurado en `mail-config.php`.
- Límites de adjuntos: hasta 5 fotos, 5 MB cada una, 15 MB en total. Si el
  hosting rechaza subidas de ese tamaño, sube el límite de PHP
  (`upload_max_filesize` / `post_max_size`) vía `.htaccess` o el panel de
  cPanel.
- Si el envío falla, revisa que las credenciales en `mail-config.php` sean
  correctas y que el puerto/cifrado coincidan (465+SSL o 587+TLS); si sigue
  sin llegar, revisa spam antes de asumir que es un problema del script.
- Si en vez de cPanel despliegas en Netlify o Vercel, `contact.php` no
  aplica (no hay PHP): usa Netlify Forms o un servicio externo como
  Formspree/Web3Forms (casi siempre de pago para adjuntar archivos) y apunta
  `PUBLIC_CONTACT_ENDPOINT` a esa URL en su lugar.

## 4. Vercel (alternativa)

El proyecto **no depende** de Vercel, pero funciona sin configuración
adicional:

1. Importa el repositorio en Vercel.
2. Framework preset: **Astro** (detectado automáticamente).
3. Build command: `npm run build`. Output directory: `dist`.
4. Añade las variables de entorno de `.env.example` que necesites
   (`PUBLIC_CONTACT_ENDPOINT`, `PUBLIC_GA_ID`, `PUBLIC_GTM_ID`) en el panel de
   Environment Variables.

## 5. Netlify (alternativa)

1. Importa el repositorio en Netlify.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Añade las mismas variables de entorno que en Vercel.
4. Netlify sirve automáticamente `404.html` para rutas no encontradas.

## 6. Variables de entorno

Copia `.env.example` a `.env` (local) o configúralas en el panel del hosting
elegido:

```
PUBLIC_CONTACT_ENDPOINT=/contact.php
PUBLIC_GA_ID=
PUBLIC_GTM_ID=
```

Ninguna es obligatoria para que el sitio compile y funcione: si faltan, el
formulario usa el fallback de WhatsApp/email y no se carga analítica (ver
README). Para el envío real de email con adjuntos, ver la sección 3 de arriba.

## 7. Después de desplegar

Continúa con **POST_DEPLOYMENT.md** para la configuración de Search Console,
GA4, dominio y redirecciones.
