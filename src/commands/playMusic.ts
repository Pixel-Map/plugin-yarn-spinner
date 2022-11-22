export function playMusic(args: Array<string>) {
  if (args.length < 1 || args.length > 2) {
    throw new Error('Invalid number of arguments');
  }

  const musicName = args[0];
  const volume = args[1] ? parseInt(args[1]) : 100;

  AudioManager.playBgm({
    name: musicName,
    pos: 0,
    pan: 0,
    pitch: 100,
    volume: volume,
  });
}
