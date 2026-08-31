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

### Registro de leads en Google Sheets

Cada envío válido del formulario (que pase la validación y el honeypot) se
registra como una fila nueva en un Google Sheet — nunca reemplaza filas
existentes. Esto usa un **Google Apps Script Web App**, no una cuenta de
servicio de Google Cloud: no requiere Composer ni credenciales de API
complejas, solo pegar un script dentro del propio Sheet.

1. Abre el Google Sheet donde quieres guardar los leads → menú
   **Extensiones → Apps Script**.
2. Borra el contenido de `Code.gs` y pega el contenido completo de
   [`scripts/google-apps-script-leads.gs`](scripts/google-apps-script-leads.gs)
   (incluido en este repo).
3. Dentro del script, reemplaza `SHARED_SECRET` por un valor secreto — debe
   coincidir **exactamente** con `SHEETS_SHARED_SECRET` en `mail-config.php`
   (paso 5).
4. Menú **Implementar → Nueva implementación** → tipo **Aplicación web**.
   Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**. Autoriza
   los permisos que pida Google (son sobre tu propio Sheet).
5. Copia la URL que termina en `/exec`. En `mail-config.php`, define:
   ```php
   define('SHEETS_WEBHOOK_URL', 'https://script.google.com/macros/s/XXXXX/exec');
   define('SHEETS_SHARED_SECRET', 'el-mismo-secreto-del-paso-3');
   ```
6. En la **fila 1** del Sheet, escribe estos encabezados, uno por columna, de
   A a AB (en este orden): `Lead ID, Fecha, Hora, Nombre, Teléfono, Email,
ZIP Code, Condado, Tipo de proyecto, Descripción, Presupuesto, Cuándo
quiere comenzar, Contacto preferido, Fotos, Fuente, Página de origen, UTM
Source, UTM Medium, UTM Campaign, Consentimiento, Estado, Carpintero
asignado, Fecha asignación, Contactado, Presupuesto realizado, Trabajo
cerrado, Valor del trabajo, Notas`.
7. Prueba el formulario en producción y confirma que aparece una fila nueva.

Notas sobre el registro en Sheets:

- Es **best-effort y no bloqueante**: si Sheets falla (URL mal copiada,
  Sheet borrado, etc.), el email de todos modos se intenta enviar, y
  viceversa. Solo se muestra error al visitante si **ambos** fallan.
- `Lead ID` se genera como `CP-YYYYMMDD-XXXXX` (fecha + 5 caracteres al azar).
- `Condado` se calcula a partir del código postal de 5 dígitos que el
  visitante haya escrito en "Ubicación", contra listas públicas de ZIP codes
  de Miami-Dade y Broward (`MIAMI_DADE_ZIPS`/`BROWARD_ZIPS` en
  `contact.php`). Si no hay un ZIP reconocible, la columna queda vacía.
- `UTM Source/Medium/Campaign` y `Página de origen` se capturan en el
  navegador (ver `captureUtmParams()` en `src/layouts/MainLayout.astro`):
  se guardan en `localStorage` la primera vez que llegan en la URL (ej. un
  clic desde un anuncio) y viajan con el formulario aunque el envío ocurra
  en una página distinta a la que recibió el clic.
- Si dejas `SHEETS_WEBHOOK_URL` vacío en `mail-config.php`, este paso se
  omite silenciosamente y solo se envía el email — útil si todavía no
  configuraste el Sheet.

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
