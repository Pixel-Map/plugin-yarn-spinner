/**
 * Stop BGM Music
 */
export function stopMusic(args: Array<string>) {
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
  AudioManager.stopBgm();

  const fadeOutDuration = args[0] ? parseInt(args[0]) : 0;
  $gameSystem.saveBgm();
  AudioManager.fadeOutBgm(fadeOutDuration);
}
