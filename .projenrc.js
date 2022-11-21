const { typescript, javascript } = require('projen');
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'plugin-yarn-spinner',

  deps: ['yarn-bound'],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'eslint-plugin-prettier',
    '@comuns-rpgmaker/plugin-metadata@github:kenerwin88/plugin-metadata',
    'esbuild',
    'prettier',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  tsconfig: {
    exclude: ['src/lunalite-pixi.mz.d.ts'],
    compilerOptions: {
      skipLibCheck: true,
      lib: ['DOM'],
    },
  },
  package: false,
  scripts: {
    bundle: './build.js',
    dev: './dev.js',
  },
  gitignore: ['/.idea', '.DS_Store'],
});

// project.bundler.addBundle('src/index.ts', {
//   target: 'es2022',
//   platform: 'browser',
// });
project.compileTask.reset();
project.compileTask.exec('./build.js');

project.synth();
