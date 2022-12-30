/**
 * Stop BGM Music
 */
export function stop_music(_callingEventId: number, duration = 0) {
  AudioManager.stopBgm();

  $gameSystem.saveBgm();
  AudioManager.fadeOutBgm(duration);
}
