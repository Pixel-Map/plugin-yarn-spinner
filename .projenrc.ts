import { typescript } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'rmmz-game',
  license: 'GPL-3.0-or-later',
  artifactsDirectory: 'dist',
  packageManager: NodePackageManager.NPM,
  projenrcTs: true,
  deps: ['yarn-bound-ts', 'typescript', '@microsoft/tsdoc', 'tablemark@2.0.0', 'lodash.get', 'yaml'],
  entrypoint: 'index.html',
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    'eslint-plugin-prettier',
    '@comuns-rpgmaker/plugin-metadata@github:kenerwin88/plugin-metadata',
    'esbuild',
    'prettier',
    'eslint-plugin-sonarjs',
    'ts-node',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  tsconfig: {
    exclude: ['src/lunalite-pixi.mz.d.ts'],
    compilerOptions: {
      target: 'ES2022',
      skipLibCheck: true,
      lib: ['ES2022', 'DOM'],
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

project.github!.tryFindWorkflow('release')!.file!.addOverride('jobs.release_github.steps', [
  { uses: 'actions/setup-node@v3', with: { 'node-version': '14.x' } },
  {
    name: 'Download build artifacts',
    uses: 'actions/download-artifact@v3',
    with: { name: 'build-artifact', path: 'dist' },
  },
  {
    // eslint-disable-next-line
    name: 'Restore build artifact permissions',
    // eslint-disable-next-line
    run: 'cd dist && setfacl --restore=permissions-backup.acl',
    'continue-on-error': true,
  },
  { name: 'Get Tag', run: 'TAG=$(cat dist/releasetag.txt); echo "TAG=$TAG" >> $GITHUB_ENV' },
  {
    name: 'Release',
    uses: 'softprops/action-gh-release@v1',
    with: {
      files: 'dist/pixelmapYarnSpinner.js\ndist/pixelmapYarnSpinner.js.map',
      body_path: '${{ github.workspace }}/dist/changelog.md',
      tag_name: '${{ env.TAG }}',
    },
  },
]);

project.synth();
