// Genera favicon/iconos/OG image a partir de public/images/brand/mark.png (logo real).
// Uso: node scripts/generate-icons.mjs
// Requiere "sharp" (ya está en dependencies). Vuelve a ejecutarse si sustituyes el logo.
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const brandDir = path.join(root, 'public/images/brand');
const iconsDir = path.join(root, 'public/icons');
const markPath = path.join(brandDir, 'mark.png');

mkdirSync(iconsDir, { recursive: true });

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const PAPER = '#FDFBF7';
const INK = '#1D1912';

/** Escala el mark manteniendo proporción y lo centra en un lienzo cuadrado. */
async function squareIcon(size, { background = TRANSPARENT, padding = 0.14 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const markBuffer = await sharp(markPath)
    .resize({ width: inner, height: inner, fit: 'contain', background: TRANSPARENT })
    .toBuffer();
  const markMeta = await sharp(markBuffer).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([
      {
        input: markBuffer,
        left: Math.round((size - (markMeta.width ?? inner)) / 2),
        top: Math.round((size - (markMeta.height ?? inner)) / 2),
      },
    ])
    .png();
}

async function run() {
  // favicon.svg — wrapper vectorial que embebe el PNG del logo (compatible con
  // <link rel="icon" type="image/svg+xml">, ya que SVG admite <image> raster).
  const faviconPngBuffer = await (await squareIcon(64, { padding: 0.08 })).toBuffer();
  const faviconBase64 = faviconPngBuffer.toString('base64');
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><image width="64" height="64" href="data:image/png;base64,${faviconBase64}"/></svg>\n`;
  writeFileSync(path.join(root, 'public/favicon.svg'), faviconSvg);

  // favicon-32.png y apple-touch-icon (fondo sólido, recomendado en iOS)
  await (await squareIcon(32, { background: PAPER, padding: 0.1 })).toFile(
    path.join(root, 'public/favicon-32.png')
  );
  await (await squareIcon(180, { background: PAPER, padding: 0.14 })).toFile(
    path.join(root, 'public/apple-touch-icon.png')
  );

  // Iconos PWA (fondo transparente, purpose "any")
  await (await squareIcon(192, { padding: 0.12 })).toFile(path.join(iconsDir, 'icon-192.png'));
  await (await squareIcon(512, { padding: 0.12 })).toFile(path.join(iconsDir, 'icon-512.png'));

  // Maskable icon: mismo mark con más padding (zona segura ~40% del lienzo)
  await (await squareIcon(512, { background: INK, padding: 0.22 })).toFile(
    path.join(iconsDir, 'icon-maskable-512.png')
  );

  // OG default image (1200x630) — fondo de marca + logo y wordmark centrados
  const ogWidth = 1200;
  const ogHeight = 630;
  const markBuffer = await sharp(markPath)
    .resize({ height: 220, fit: 'contain', background: TRANSPARENT })
    .toBuffer();
  const markMeta = await sharp(markBuffer).metadata();
  const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="80"><text x="0" y="60" font-family="Georgia, 'Fraunces', serif" font-size="64" font-weight="600" fill="${INK}">Carpintero<tspan fill="#B17434">Pro</tspan></text></svg>`;
  const wordmarkBuffer = await sharp(Buffer.from(wordmarkSvg)).png().toBuffer();
  const wordmarkMeta = await sharp(wordmarkBuffer).metadata();

  const gap = 32;
  const groupWidth = (markMeta.width ?? 0) + gap + (wordmarkMeta.width ?? 0);
  const groupLeft = Math.round((ogWidth - groupWidth) / 2);

  await sharp({ create: { width: ogWidth, height: ogHeight, channels: 4, background: PAPER } })
    .composite([
      {
        input: markBuffer,
        left: groupLeft,
        top: Math.round((ogHeight - (markMeta.height ?? 220)) / 2),
      },
      {
        input: wordmarkBuffer,
        left: groupLeft + (markMeta.width ?? 0) + gap,
        top: Math.round((ogHeight - (wordmarkMeta.height ?? 80)) / 2),
      },
    ])
    .png()
    .toFile(path.join(root, 'public/og-default.png'));

  console.log('Iconos y OG image generados en /public.');
}

run().catch((err) => {
  console.error('generate-icons.mjs failed:', err);
  process.exitCode = 1;
});
