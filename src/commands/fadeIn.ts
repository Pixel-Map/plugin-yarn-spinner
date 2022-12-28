export function fadeIn(args: Array<number>) {
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
  const [duration = 24] = args;
  $gameScreen.startTint([0, 0, 0, 0], duration);
  $gameScreen.startFadeIn(duration);
}
