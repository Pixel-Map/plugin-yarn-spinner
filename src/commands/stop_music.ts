/**
 * Stops the playing music.
 * @param duration - Fadeout time, defaults to 0 (no fadeout)
 */
export function stop_music(_callingEventId: number, duration: number = 0) {
  AudioManager.stopBgm();

  $gameSystem.saveBgm();
  AudioManager.fadeOutBgm(duration);
}
