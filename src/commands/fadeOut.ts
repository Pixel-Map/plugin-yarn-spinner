export function fadeOut(args: Array<number>) {
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
  // @ts-ignore
  SceneManager._scene._active = false;
  $gameScreen.startFadeOut(args[0] ? args[0] : 24);
}
