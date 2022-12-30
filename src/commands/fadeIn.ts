export function fadeIn(_callingEventId: number, duration = 24) {
  $gameScreen.startTint([0, 0, 0, 0], duration);
  $gameScreen.startFadeIn(duration);
}
