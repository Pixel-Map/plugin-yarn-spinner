#!/usr/bin/env node
const generate = require('@comuns-rpgmaker/plugin-metadata');

generate('src/metadata.yaml').then((header) => {
  require('esbuild')
    .build({
      logLevel: 'info',
      entryPoints: ['src/index.ts'],
      bundle: true,
      sourcemap: true,
      outfile: 'js/plugins/pixelmapYarnSpinner.js',
      banner: {
        js: header,
      },
      minify: false,
      watch: true,
    })
    .catch(() => process.exit(1));
});
