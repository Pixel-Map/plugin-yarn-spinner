export function fadeIn(args: Array<number>) {
  if (args.length > 6) {
    throw new Error('Invalid number of arguments');
  }
  const [duration = 24, red = 0, green = 0, blue = 0, grey = 0, alpha = 1] = args;

  if (args.length <= 1) {
    $gameScreen.startFadeIn(duration);
  } else {
    console.log('fade in with color');
    console.log(duration, red, green, blue, grey, alpha, duration);
    $gameScreen.startTint([red * alpha, green * alpha, blue * alpha, grey * alpha], duration);
  }
}
