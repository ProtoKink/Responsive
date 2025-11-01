import fs from 'fs';
import path from 'path';

const allowedExtensions = ['html', 'js', 'css', 'json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'lang', 'txt'];

/**
 * @param {string} inputDir 
 * @param {string} outputDir 
 */
function copyMatchingFiles(inputDir, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const items = fs.readdirSync(inputDir, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(inputDir, item.name);
    const destPath = path.join(outputDir, item.name);

    if (item.isDirectory()) {
      copyMatchingFiles(srcPath, destPath);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).slice(1).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

const sourceFolder = path.resolve('./public');
const targetFolder = path.resolve('./dist/public');

copyMatchingFiles(sourceFolder, targetFolder);