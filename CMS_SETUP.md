# Panel de contenido (CMS) — CarpinteroPro

El proyecto incluye un panel de administración tipo CRM en `/admin`: completas
un formulario para un servicio, producto, proyecto o artículo de blog, das
clic en **Publish**, y el panel crea/edita el archivo correspondiente
directamente en el repositorio (un commit real). No necesitas tocar código ni
editar Markdown a mano.

Usa [Decap CMS](https://decapcms.org) (el sucesor de Netlify CMS), ya
configurado en `public/admin/config.yml` con un formulario para cada
colección de contenido (Servicios, Productos, Proyectos y Blog, en español e
inglés).

**El panel es 100% opcional.** El sitio sigue funcionando exactamente igual
si nunca lo configuras — puedes seguir creando contenido a mano o con
`npm run new:post` (ver CONTENT_GUIDE.md). Esto es sólo una capa adicional
para quien prefiera un formulario en el navegador.

## Por qué hace falta configurarlo antes de usarlo

El panel guarda los cambios haciendo un **commit a Git**, así que necesita:

1. Que el proyecto esté en un repositorio Git con un remoto (GitHub) — ya
   está: [github.com/ander2010/carpinteropro](https://github.com/ander2010/carpinteropro).
2. Un mecanismo de autenticación para saber quién tiene permiso de guardar.

El sitio real se despliega en **Hostinger** (ver DEPLOYMENT.md), no en
Netlify, así que el panel usa el backend `github` de Decap CMS en lugar de
`git-gateway` (que solo funciona si el sitio corre en Netlify). El backend
`github` necesita una **GitHub OAuth App** más un pequeño servidor que haga
el intercambio de código→token (GitHub no permite hacer ese paso desde el
navegador directamente, por seguridad: expondría el Client Secret). Ese
servidor va en **Cloudflare Workers** (gratis, sin tarjeta), es un único
archivo (`tools/decap-oauth-worker/index.js`) y no tiene nada que ver con
dónde vive el sitio — Hostinger sigue sirviendo `carpinteropro.com` exactamente
igual que hoy.

## Pasos de configuración

### 1. Crea la GitHub OAuth App

1. En GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
   (o directo en [github.com/settings/developers](https://github.com/settings/developers)).
2. Rellena:
   - **Application name**: `CarpinteroPro CMS` (o lo que prefieras).
   - **Homepage URL**: `https://carpinteropro.com`
   - **Authorization callback URL**: `https://carpinteropro-decap-oauth.TU-SUBDOMINIO.workers.dev/callback`
     (el subdominio exacto lo sabrás en el paso 2 — puedes volver a editar
     esta URL después de desplegar el Worker, GitHub te deja cambiarla).
3. Guarda. Copia el **Client ID** y genera un **Client Secret** (solo se
   muestra una vez — cópialo a un lugar seguro).

### 2. Despliega el proxy OAuth en Cloudflare Workers

El código ya está en `tools/decap-oauth-worker/` en este repo.

**Opción A — con Wrangler (CLI, recomendado):**

```bash
cd tools/decap-oauth-worker
npx wrangler login          # abre el navegador, inicia sesión en Cloudflare (gratis)
npx wrangler deploy         # crea el Worker y te da su URL (....workers.dev)
npx wrangler secret put OAUTH_CLIENT_ID
npx wrangler secret put OAUTH_CLIENT_SECRET
```

Pega el Client ID y Client Secret de GitHub cuando te los pida cada comando.

**Opción B — desde el dashboard de Cloudflare (sin terminal):**

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers &
   Pages → Create → Create Worker**. Ponle el nombre `carpinteropro-decap-oauth`.
2. En el editor, borra el código de ejemplo y pega el contenido completo de
   `tools/decap-oauth-worker/index.js`. **Deploy**.
3. **Settings → Variables and Secrets** → agrega `OAUTH_CLIENT_ID` (texto
   normal) y `OAUTH_CLIENT_SECRET` (marca como **Secret**) con los valores de
   GitHub. Guarda (esto vuelve a desplegar el Worker automáticamente).

Al terminar, Cloudflare te muestra la URL final, algo como
`https://carpinteropro-decap-oauth.tu-usuario.workers.dev`.

### 3. Conecta la URL del Worker en los dos lugares que la necesitan

1. **En GitHub** (la OAuth App del paso 1): edita la **Authorization
   callback URL** para que sea exactamente `<URL-del-Worker>/callback`.
2. **En este repo**: abre `public/admin/config.yml` y reemplaza la línea
   `base_url:` por la URL real del Worker (sin `/callback` al final, esa
   parte la agrega Decap solo). Haz commit y push de ese cambio — el deploy
   de Hostinger lo recoge automáticamente.

### 4. Entra al panel

Visita `https://carpinteropro.com/admin/`, clic en **Login with GitHub**,
autoriza la app, y ya puedes crear/editar contenido desde el formulario.

El backend `github` solo deja guardar a cuentas de GitHub con permiso de
escritura sobre el repositorio (tú, o quien invites como colaborador en
GitHub) — no hace falta un paso extra de "invitar usuarios" como con Netlify
Identity.

Cada `Publish` desde el panel crea un commit real en `main`. Como el
repositorio ya tiene Git auto-deploy activado en Hostinger (ver
DEPLOYMENT.md), ese commit dispara la reconstrucción del sitio igual que un
`git push` hecho a mano.

## Importante: slugs entre idiomas

Cuando crees la versión en inglés de un servicio/producto/proyecto que ya
existe en español (o viceversa), usa exactamente el mismo valor en el campo
**URL Slug** de ambos. El selector de idioma del sitio construye la URL del
otro idioma reemplazando sólo el prefijo (`/es/...` ↔ `/en/...`), así que si
los slugs no coinciden, el visitante caerá en una página que no existe al
cambiar de idioma.

## Subir imágenes desde el panel

Las imágenes que subas desde el CMS se guardan en `public/images/uploads/` y
quedan disponibles automáticamente en las páginas. Para mejor rendimiento,
sube imágenes ya optimizadas (WebP, tamaño razonable) — el panel no
comprime las imágenes por ti.
