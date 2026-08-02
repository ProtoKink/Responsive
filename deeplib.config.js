import { defineConfig } from 'bc-deeplib/build';

export default defineConfig({
  entry: 'responsive.ts',
  outfile: 'main.js',
  modInfo: {
    name: 'Responsive',
    fullName: 'BC Responsive',
    repository: 'https://github.com/ProtoKink/Responsive',
  },
  globalName: 'Responsive',
  distDirName: 'dist',
  publicDirName: 'public',
  scripts: ['./scripts/compile_scss.js', './scripts/copy_files.js'],
  prodRemoteURL: 'https://protokink.github.io/Responsive',
  devRemoteURL: 'https://protokink.github.io/Responsive/dev',
  host: 'localhost',
  port: 45000,
});