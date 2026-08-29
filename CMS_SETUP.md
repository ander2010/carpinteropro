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

1. Que el proyecto esté en un repositorio Git con un remoto (GitHub).
2. Un mecanismo de autenticación para saber quién tiene permiso de guardar.

La forma más simple de resolver ambos puntos sin escribir código adicional es
desplegar el sitio en **Netlify** y usar **Netlify Identity + Git Gateway**
(gratis en el plan Starter de Netlify). El sitio en sí sigue siendo 100%
portable a cualquier hosting (ver DEPLOYMENT.md) — sólo el panel `/admin`
depende de esta pieza concreta.

## Pasos de configuración

### 1. Sube el proyecto a GitHub

```bash
git init   # si aún no es un repositorio (puede que ya lo hayas hecho)
git add .
git commit -m "Initial commit"
```

Crea un repositorio nuevo en [github.com/new](https://github.com/new) y
conéctalo:

```bash
git remote add origin https://github.com/TU-USUARIO/carpinteropro.git
git branch -M main
git push -u origin main
```

### 2. Despliega el sitio en Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → conecta tu cuenta de GitHub y elige el
   repositorio.
2. Build command: `npm run build`. Publish directory: `dist`.
3. Despliega. Confirma que el sitio carga correctamente en la URL de Netlify.

### 3. Activa Netlify Identity

1. En el panel del sitio en Netlify: **Site configuration → Identity → Enable
   Identity**.
2. En **Registration preferences**, elige **Invite only** (para que sólo tú —
   u otras personas que invites — puedan entrar al panel).

### 4. Activa Git Gateway

1. Dentro de **Identity → Services → Git Gateway**, haz clic en **Enable Git
   Gateway**. Esto permite que Netlify Identity autorice los commits al
   repositorio en tu nombre, sin que tengas que crear un token de GitHub
   manualmente.

### 5. Invítate como usuario

1. **Identity → Invite users**, escribe tu propio email.
2. Revisa tu correo y acepta la invitación (te pedirá crear una contraseña).

### 6. Entra al panel

Visita `https://TU-SITIO.netlify.app/admin/` (o tu dominio una vez lo
conectes), inicia sesión con el usuario que acabas de crear, y ya puedes
crear/editar contenido desde el formulario.

Cada vez que guardas algo en el panel, Netlify **reconstruye el sitio
automáticamente** con el nuevo contenido (normalmente en 1-2 minutos).

## Después de conectar tu dominio propio

Cuando `carpinteropro.com` apunte a Netlify (ver POST_DEPLOYMENT.md), el
panel queda disponible en `https://carpinteropro.com/admin/` — no necesitas
cambiar nada en `config.yml`.

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

## Si prefieres no usar Netlify

Decap CMS también soporta el backend `github` con OAuth propio (sin Netlify),
pero requiere desplegar un pequeño servidor proxy de autenticación (por
ejemplo, con una función serverless en Vercel). Es más trabajo de
configuración; si te interesa esta ruta, documenta primero tu elección de
hosting y podemos ajustar `public/admin/config.yml` (`backend.name: github`)
en consecuencia.
