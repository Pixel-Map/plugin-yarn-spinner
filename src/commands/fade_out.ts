export function fade_out(_callingEventId: number, duration = 24, red = 0, green = 0, blue = 0, grey = 0, alpha = 1) {
  if (red === 0 && green === 0 && blue === 0 && grey === 0 && alpha === 1) {
    $gameScreen.startFadeOut(duration);
  } else {
    $gameScreen.startTint([red * alpha, green * alpha, blue * alpha, grey * alpha], duration);
  }
}
