export function fadeIn(args: Array<number>) {
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
  // @ts-ignore
  $gameScreen.startFadeIn(args[0] ? args[0] : 24);
  // @ts-ignore
  SceneManager._scene._active = true;
}
