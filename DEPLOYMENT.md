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

El formulario de presupuesto (`QuoteForm`) envía por defecto a `/contact.php`
(no hace falta configurar `PUBLIC_CONTACT_ENDPOINT`; ese es el valor por
defecto embebido en el código si la variable no está definida en el build).
`contact.php` manda un email de verdad, con las fotos adjuntas, a
`info@carpinteropro.com`, por **SMTP autenticado** usando
[PHPMailer](https://github.com/PHPMailer/PHPMailer) (código incluido en
`public/lib/phpmailer/`, sin Composer). Usa SMTP y no la función `mail()` de
PHP a propósito: `mail()` "acepta" el envío (devuelve `true`) pero en hosting
compartido (Hostinger incluido — está documentado por ellos mismos) el correo
casi nunca llega, porque sale sin autenticación SPF/DKIM y el servidor de
destino lo descarta o lo manda a spam.

Falta un solo paso manual, que **no se puede automatizar por git**: crear
`mail-config.php` con las credenciales SMTP reales. Ese archivo está en
`.gitignore` a propósito (no se debe exponer una contraseña en un
repositorio público) — pero justo por eso hay que subirlo aparte, y el
**dónde** depende de cómo despliegas:

### Si usas Git auto-deploy (hPanel → Advanced/Avanzado → Git)

Ese deploy **reemplaza por completo** el contenido de la carpeta pública en
cada push — cualquier archivo que subas ahí a mano (esté o no en git)
desaparece en el siguiente `git push`. Por eso `contact.php` busca
`mail-config.php` primero **un nivel arriba** de la carpeta pública (fuera de
lo que el deploy reemplaza) y, si no está ahí, dentro de la carpeta pública
como respaldo.

1. Crea un buzón de correo real en hPanel → **Emails → Administrar → Crear
   cuenta de correo** (ej. `info@carpinteropro.com`).
2. Copia `public/mail-config.example.php`, complétalo con los datos reales
   (host SMTP, el buzón que acabas de crear como usuario, y **la contraseña
   de ese buzón** — no la de tu cuenta de Hostinger/hPanel) y guárdalo como
   `mail-config.php`.
3. En hPanel → **Administrador de archivos**, sube ese archivo a la carpeta
   **padre** de la carpeta que Git despliega (si el deploy target es
   `public_html/`, el archivo va un nivel arriba de `public_html/`, no
   dentro).
4. Haz push a `main` (o espera el deploy en curso) y prueba el formulario en
   producción.

### Si compilas tú y subes `dist/` por FTP manual

Aquí no hay riesgo de que un deploy automático borre nada, así que es más
simple:

1. Igual que arriba: crea el buzón y completa `mail-config.php` a partir de
   `public/mail-config.example.php`.
2. Colócalo dentro de `public/` (junto a `contact.php`) **antes** de correr
   `npm run build` — se copia solo a `dist/` porque Astro copia `public/` tal
   cual (y sigue sin subirse a git).
3. `npm run build` y sube el contenido de `dist/` como siempre.
4. Prueba el formulario en producción.

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

Ninguna es obligatoria: `PUBLIC_CONTACT_ENDPOINT` ya vale `/contact.php` por
defecto aunque no exista `.env` en el entorno que compila el sitio (útil para
pipelines de deploy que no leen `.env`, como el Git auto-deploy de hPanel);
solo hace falta definirla si quieres apuntar a otro endpoint distinto. Sin
`PUBLIC_GA_ID`/`PUBLIC_GTM_ID` simplemente no se carga analítica. El envío
real de email con adjuntos sí requiere un paso manual aparte (`mail-config.php`
con credenciales SMTP) — ver la sección 3 de arriba.

## 7. Después de desplegar

Continúa con **POST_DEPLOYMENT.md** para la configuración de Search Console,
GA4, dominio y redirecciones.
