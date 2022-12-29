export function flashScreen(args: Array<number>) {
  if (args.length > 6) {
    throw new Error('Invalid number of arguments');
  }
  const [duration = 8, red = 0, green = 0, blue = 0, intensity = 255] = args;
  $gameScreen.startFlash([red, green, blue, intensity], duration);
}
