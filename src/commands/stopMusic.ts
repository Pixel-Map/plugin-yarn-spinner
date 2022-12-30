/**
 * Stop BGM Music
 */
export function stopMusic(_callingEventId: number, duration = 0) {
  AudioManager.stopBgm();

  $gameSystem.saveBgm();
  AudioManager.fadeOutBgm(duration);
}
