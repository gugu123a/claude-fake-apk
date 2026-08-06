import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '..', 'assets');

const SIZES = {
  'icon.png': 1024,
  'android-icon-foreground.png': 1024,
  'android-icon-background.png': 1024,
  'android-icon-monochrome.png': 1024,
  'favicon.png': 48,
  'splash-icon.png': 256,
};

const CORAL = '#cc785c';
const CREAM = '#faf9f5';
const WHITE = '#ffffff';
const DARK = '#141413';

// --- Helper: create an SVG for a coral circle Claude-style icon ---
function claudeIconSvg(size, mode = 'color') {
  const pad = Math.round(size * 0.08);
  const circleR = Math.round(size * 0.38);
  const cx = Math.round(size / 2);
  const cy = Math.round(size / 2);

  switch (mode) {
    case 'foreground':
      // Coral circle on transparent
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${cx}" cy="${cy}" r="${circleR}" fill="${CORAL}" />
          <text x="${cx}" y="${cy + Math.round(size * 0.12)}"
                font-family="Georgia, serif" font-size="${Math.round(size * 0.38)}"
                font-weight="400" fill="${WHITE}" text-anchor="middle" dominant-baseline="central">
            C
          </text>
        </svg>`;
    case 'monochrome':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${cx}" cy="${cy}" r="${circleR}" fill="${WHITE}" />
          <text x="${cx}" y="${cy + Math.round(size * 0.12)}"
                font-family="Georgia, serif" font-size="${Math.round(size * 0.38)}"
                font-weight="400" fill="${DARK}" text-anchor="middle" dominant-baseline="central">
            C
          </text>
        </svg>`;
    case 'splash':
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${cx}" cy="${cy}" r="${Math.round(size * 0.3)}" fill="${CORAL}" />
          <text x="${cx}" y="${cy + Math.round(size * 0.1)}"
                font-family="Georgia, serif" font-size="${Math.round(size * 0.28)}"
                font-weight="400" fill="${WHITE}" text-anchor="middle" dominant-baseline="central">
            C
          </text>
        </svg>`;
    default:
      // Full color app icon: coral circle on cream background
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="${CREAM}" />
          <circle cx="${cx}" cy="${cy}" r="${circleR}" fill="${CORAL}" />
          <text x="${cx}" y="${cy + Math.round(size * 0.12)}"
                font-family="Georgia, serif" font-size="${Math.round(size * 0.38)}"
                font-weight="400" fill="${WHITE}" text-anchor="middle" dominant-baseline="central">
            C
          </text>
        </svg>`;
  }
}

async function generate() {
  for (const [filename, size] of Object.entries(SIZES)) {
    let mode = 'default';
    if (filename === 'android-icon-foreground.png') mode = 'foreground';
    else if (filename === 'android-icon-monochrome.png') mode = 'monochrome';
    else if (filename === 'splash-icon.png') mode = 'splash';

    const svg = claudeIconSvg(size * 2, mode); // 2x for retina
    const outPath = path.join(assetsDir, filename);

    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outPath);

    console.log(`✅ ${filename} (${size}x${size})`);
  }
  console.log('\n🎉 All icons generated!');
}

generate().catch(console.error);
