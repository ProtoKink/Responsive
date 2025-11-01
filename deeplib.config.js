import { defineConfig } from 'bc-deeplib/build';

export default defineConfig({
  entry: 'responsive.ts',
  outfile: 'main.js',
  globalName: 'Responsive',
  distDirName: 'dist',
  publicDirName: 'public',
  scripts: ['./scripts/compile_scss.js', './scripts/copy_files.js'],
  prodRemoteURL: 'https://ddeeplb.github.io/BC-Responsive',
  devRemoteURL: 'https://ddeeplb.github.io/BC-Responsive/dev',
  host: 'localhost',
  port: 45000,
});