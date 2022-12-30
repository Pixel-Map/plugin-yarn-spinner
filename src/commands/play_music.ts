export function play_music(_callingEventId: number, musicName: string, volume = 100) {
  AudioManager.playBgm({
    name: musicName,
    pos: 0,
    pan: 0,
    pitch: 100,
    volume: volume,
  });
}
