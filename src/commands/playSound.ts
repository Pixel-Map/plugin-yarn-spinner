export function playSound(args: Array<string>) {
  if (args.length != 2) {
    throw new Error('Invalid number of arguments');
  }

  const soundName = args[0];
  const volume = parseInt(args[1]);

  AudioManager.playSe({
    name: soundName,
    pan: 0,
    pitch: 100,
    volume: volume,
    pos: 0,
  });
}
