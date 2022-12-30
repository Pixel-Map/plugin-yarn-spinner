export function playSound(_callingEventId: number, soundName: string, volume = 100) {
  AudioManager.playSe({
    name: soundName,
    pan: 0,
    pitch: 100,
    volume: volume,
    pos: 0,
  });
}
