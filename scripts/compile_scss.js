import * as sass from 'sass';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/styles');
const outputDir = path.join(__dirname, '../dist/public/styles');

fs.mkdirSync(outputDir, { recursive: true });

function compileSassAll() {
  const scssFiles = fs
    .readdirSync(inputDir)
    .filter((file) => file.endsWith('.scss'));
  
  scssFiles.forEach((file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    compileSassOne(inputPath, outputPath);
  });
}

/**
 * @param {string} inputPath 
 * @param {string} outputPath 
 */
function compileSassOne(inputPath, outputPath) {
  const scssFile = fs.readFileSync(inputPath, 'utf8');
  const result = sass.compileString(scssFile, {
    sourceMap: true,
    style: 'expanded',
    syntax: 'scss',
  });
  const cssWithMap = result.css + `\n/*# sourceMappingURL=${path.basename(outputPath).replace(/\.scss$/, '.css.map')} */\n`;

  fs.writeFileSync(outputPath.replace(/\.scss$/, '.css'), cssWithMap);
  fs.writeFileSync(outputPath.replace(/\.scss$/, '.css.map'), JSON.stringify(result.sourceMap));
}

compileSassAll();
