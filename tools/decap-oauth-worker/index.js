// Proxy OAuth para Decap CMS (backend "github"), pensado para desplegarse
// gratis en Cloudflare Workers. El sitio en sí sigue en Hostinger — esto
// solo resuelve el login de /admin: Decap CMS abre un popup a "/auth", el
// popup redirige a GitHub, GitHub vuelve a "/callback" con un código, y este
// worker lo cambia por un access token y se lo pasa al popup original vía
// postMessage. Ver CMS_SETUP.md para las instrucciones de despliegue.
//
// Variables de entorno requeridas (Settings → Variables and Secrets, en el
// Worker de Cloudflare):
//   OAUTH_CLIENT_ID      — Client ID de la GitHub OAuth App
//   OAUTH_CLIENT_SECRET  — Client Secret de la GitHub OAuth App (Secret, no texto plano)

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'decap_oauth_state';

function randomState() {
  return crypto.randomUUID().replace(/-/g, '');
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

function htmlResponse(body, init = {}) {
  return new Response(body, {
    ...init,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...(init.headers || {}) },
  });
}

async function handleAuth(url, env) {
  if (!env.OAUTH_CLIENT_ID) {
    return htmlResponse('Falta configurar OAUTH_CLIENT_ID en el Worker.', { status: 500 });
  }

  const state = randomState();
  const redirectUri = `${url.origin}/callback`;

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set('client_id', env.OAUTH_CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'repo,user');
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Max-Age=600; Path=/; Secure; HttpOnly; SameSite=Lax`,
    },
  });
}

async function handleCallback(url, request, env) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = getCookie(request, STATE_COOKIE);

  const clearCookie = `${STATE_COOKIE}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax`;

  if (!code || !state || !cookieState || state !== cookieState) {
    return htmlResponse('Solicitud inválida o expirada. Cierra esta ventana e inténtalo de nuevo desde /admin.', {
      status: 400,
      headers: { 'Set-Cookie': clearCookie },
    });
  }

  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/callback`,
    }),
  });

  const data = await tokenRes.json();

  if (!tokenRes.ok || data.error || !data.access_token) {
    const message = (data && (data.error_description || data.error)) || 'No se pudo obtener el token.';
    return htmlResponse(`Error de autenticación: ${message}`, {
      status: 401,
      headers: { 'Set-Cookie': clearCookie },
    });
  }

  const payload = JSON.stringify({ token: data.access_token, provider: 'github' });

  // Protocolo que espera Decap CMS del lado del popup: primero avisa que
  // está autorizando, espera a que la ventana que lo abrió responda, y
  // entonces le manda el token real.
  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          if (e.data !== 'authorizing:github') return;          // ignora mensajes de extensiones
          if (e.origin !== 'https://carpinteropro.com' && e.origin !== 'https://www.carpinteropro.com') return; // solo responde a tu panel
          window.opener.postMessage('authorization:github:success:${payload.replace(/'/g, "\\'")}', e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
    Puedes cerrar esta ventana.
  </body>
</html>`;

  return htmlResponse(html, { headers: { 'Set-Cookie': clearCookie } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/auth') return handleAuth(url, env);
    if (url.pathname === '/callback') return handleCallback(url, request, env);

    return htmlResponse(
      'Proxy OAuth de Decap CMS para CarpinteroPro. Rutas disponibles: /auth, /callback.',
      { status: 404 },
    );
  },
};
