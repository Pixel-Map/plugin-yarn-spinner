/**
 * Fade in the screen back to normal
 * @param duration - Length of time for fade-in duration, default of 24 frames
 */
export function fade_in(_callingEventId: number, duration: number = 24) {
  $gameScreen.startTint([0, 0, 0, 0], duration);
  $gameScreen.startFadeIn(duration);
}
