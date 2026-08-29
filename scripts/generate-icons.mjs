// Genera favicon/iconos/OG image a partir de public/images/brand/mark.svg y logo.svg.
// Uso: node scripts/generate-icons.mjs
// Requiere "sharp" (ya está en dependencies). Se ejecuta una vez tras npm install;
// vuelve a ejecutarse si sustituyes el logo por uno real en public/images/brand/.
import sharp from 'sharp';
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const brandDir = path.join(root, 'public/images/brand');
const iconsDir = path.join(root, 'public/icons');
const markSvg = readFileSync(path.join(brandDir, 'mark.svg'));

mkdirSync(iconsDir, { recursive: true });

async function run() {
  // favicon.svg — copia directa del mark
  copyFileSync(path.join(brandDir, 'mark.svg'), path.join(root, 'public/favicon.svg'));

  // favicon.ico (32x32 PNG-based ico via sharp png then simple rename is not a real ICO;
  // usamos PNG 32x32 y 180x180 apple-touch, que cubren la inmensa mayoría de navegadores actuales)
  await sharp(markSvg).resize(32, 32).png().toFile(path.join(root, 'public/favicon-32.png'));
  await sharp(markSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(root, 'public/apple-touch-icon.png'));
  await sharp(markSvg).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'));
  await sharp(markSvg).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'));

  // Maskable icon: mismo mark con más padding (zona segura ~40% del lienzo)
  const maskableSize = 512;
  const markSize = Math.round(maskableSize * 0.6);
  const offset = Math.round((maskableSize - markSize) / 2);
  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: '#1D1912',
    },
  })
    .composite([
      {
        input: await sharp(markSvg).resize(markSize, markSize).toBuffer(),
        left: offset,
        top: offset,
      },
    ])
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  // OG default image (1200x630) — fondo de marca + logo centrado
  const logoBuffer = await sharp(path.join(brandDir, 'logo.svg')).resize({ width: 480 }).toBuffer();
  const logoMeta = await sharp(logoBuffer).metadata();
  const ogWidth = 1200;
  const ogHeight = 630;
  await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: '#FDFBF7',
    },
  })
    .composite([
      {
        input: logoBuffer,
        left: Math.round((ogWidth - (logoMeta.width ?? 480)) / 2),
        top: Math.round((ogHeight - (logoMeta.height ?? 96)) / 2),
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
