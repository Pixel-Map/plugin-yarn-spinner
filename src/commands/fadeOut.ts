export function fadeOut(args: Array<number>) {
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
  $gameScreen.startFadeOut(args[0] ? args[0] : 24);
}
