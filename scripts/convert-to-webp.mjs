// Script to convert PNG images to WebP format for better performance
import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, parse } from 'path';

const PUBLIC_DIR = './public';
const OUTPUT_DIR = './public';

// Images to convert
const imagesToConvert = [
  'banner.png',
  'og-image.png',
  'logo.png',
];

async function convertToWebP() {
  console.log('🖼️  Converting images to WebP format...\n');

  for (const imageName of imagesToConvert) {
    const inputPath = join(PUBLIC_DIR, imageName);
    const { name } = parse(imageName);
    const outputPath = join(OUTPUT_DIR, `${name}.webp`);

    if (!existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${imageName} - file not found`);
      continue;
    }

    try {
      const info = await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      // Get original file size
      const originalSize = (await sharp(inputPath).metadata()).size || 0;
      const newSize = info.size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`✅ ${imageName} → ${name}.webp`);
      console.log(`   Size: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (-${reduction}%)\n`);
    } catch (error) {
      console.error(`❌ Error converting ${imageName}:`, error.message);
    }
  }

  console.log('🎉 Conversion complete!');
  console.log('\n📝 Remember to update your image references:');
  console.log('   - Change src="/banner.png" to src="/banner.webp"');
  console.log('   - Or use <picture> element for fallback support');
}

convertToWebP();
