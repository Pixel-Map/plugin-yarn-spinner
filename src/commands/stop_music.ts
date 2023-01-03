/**
 * Stops the playing music.
 * @param duration - Fadeout time, defaults to 0 (no fadeout)
 * @remarks Audio
 */
export function stop_music(_callingEventId: number, duration: number = 0) {
  $gameSystem.saveBgm();
  AudioManager.fadeOutBgm(duration);
}
