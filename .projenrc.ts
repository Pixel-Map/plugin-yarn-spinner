import { typescript } from 'projen';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'rmmz-game',
  artifactsDirectory: 'dist',
  projenrcTs: true,
  deps: ['yarn-bound'],
  entrypoint: 'index.html',
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'eslint-plugin-prettier',
    '@comuns-rpgmaker/plugin-metadata@github:kenerwin88/plugin-metadata',
    'esbuild',
    'prettier',
    'eslint-plugin-sonarjs',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  tsconfig: {
    exclude: ['src/lunalite-pixi.mz.d.ts'],
    compilerOptions: {
      skipLibCheck: true,
      lib: ['DOM'],
    },
    include: ['.projenrc.ts'],
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
project.eslint?.addExtends('plugin:sonarjs/recommended');
project.compileTask.reset();
project.compileTask.exec('./build.js');

// Add RPGMaker stuff to package.json
const packageJson = project.tryFindObjectFile('package.json');
packageJson?.addOverride('chromium-args', '--force-color-profile=srgb');
packageJson?.addOverride('window', {
  title: 'plugin-yarn-spinner',
  width: 816,
  height: 624,
  position: 'center',
  icon: 'icon/icon.png',
});

project.synth();
