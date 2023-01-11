#!/usr/bin/env node
const generate = require('@comuns-rpgmaker/plugin-metadata');

generate('src/metadata.yaml').then((header) => {
  require('esbuild')
    .build({
      logLevel: 'info',
      globalName: 'pixelmapYarnSpinner',
      entryPoints: ['src/index.ts'],
      bundle: true,
      sourcemap: true,
      outfile: 'dist/pixelmapYarnSpinner.js',
      banner: {
        js: header,
      },
      minify: true,
      watch: false,
    })
    .catch(() => process.exit(1));
});
