import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const assets = join(root, 'assets');

const WIDTH = 1024;
const HEIGHT = 500;
const SOURCE = join(assets, 'sirpriceme-feature-source.png');

const TITLE_COLOR = '#021E57';
const TAGLINE_BG = '#F5FDFF';

const TAGLINE = {
  coverX: 414,
  coverY: 282,
  coverWidth: 606,
  coverHeight: 58,
  textX: 428,
  textY: 323,
};

const VARIANTS = {
  sl: {
    tagline: null,
  },
  en: {
    tagline: 'Photo • price estimate • sell',
    taglineSize: 38,
  },
  hr: {
    tagline: 'Fotografiraj • procijeni cijenu • prodaj',
    taglineSize: 29,
  },
  de: {
    tagline: 'Foto • Preis schätzen • verkaufen',
    taglineSize: 34,
  },
};

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const NBSP = '&#160;';

function buildTaglineTspans(tagline, taglineSize) {
  const parts = tagline.split(' • ');
  const bulletSize = Math.round(taglineSize * 0.58);
  let markup = `<tspan font-size="${taglineSize}" font-weight="600">${escapeXml(parts[0])}${NBSP}</tspan>`;

  for (let index = 1; index < parts.length; index += 1) {
    const part = parts[index];
    const trailingSpace = index < parts.length - 1 ? NBSP : '';
    markup += `<tspan font-size="${bulletSize}" font-weight="700">•</tspan>`;
    markup += `<tspan font-size="${taglineSize}" font-weight="600">${NBSP}${escapeXml(part)}${trailingSpace}</tspan>`;
  }

  return markup;
}

function buildTaglineOverlay(tagline, taglineSize) {
  const taglineMarkup = buildTaglineTspans(tagline, taglineSize);

  return Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect
    x="${TAGLINE.coverX}"
    y="${TAGLINE.coverY}"
    width="${TAGLINE.coverWidth}"
    height="${TAGLINE.coverHeight}"
    fill="${TAGLINE_BG}"
  />
  <text
    x="${TAGLINE.textX}"
    y="${TAGLINE.textY}"
    font-family="Segoe UI, Helvetica Neue, Arial, sans-serif"
    fill="${TITLE_COLOR}"
    xml:space="preserve"
  >${taglineMarkup}</text>
</svg>`);
}

async function loadBaseGraphic() {
  const zoom = 1.22;

  return sharp(SOURCE)
    .resize(Math.round(WIDTH * zoom), Math.round(HEIGHT * zoom), {
      fit: 'cover',
      position: 'centre',
    })
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
}

async function buildFeatureGraphic(base, config) {
  if (!config.tagline) {
    return base;
  }

  const overlay = buildTaglineOverlay(config.tagline, config.taglineSize);

  return sharp(base)
    .composite([{ input: overlay, left: 0, top: 0 }])
    .png()
    .toBuffer();
}

async function main() {
  const outDir = join(assets, 'play-store');
  await mkdir(outDir, { recursive: true });
  const base = await loadBaseGraphic();

  for (const [locale, config] of Object.entries(VARIANTS)) {
    const output = await buildFeatureGraphic(base, config);
    const filename = `play-feature-graphic-${locale}-1024x500.png`;
    const target = join(outDir, filename);
    await writeFile(target, output);

    if (locale === 'sl') {
      await writeFile(join(assets, 'play-feature-graphic-1024x500.png'), output);
      await writeFile(join(assets, 'play-feature-graphic.png'), output);
    }

    console.log(`Wrote ${target}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
