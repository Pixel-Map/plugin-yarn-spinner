/**
 * Plays a music file
 * @param music_name - Name of the music file to play
 * @param volume - Volume to play it at, defaults to full volume (100)
 * @remarks Audio
 */
export function play_music(_callingEventId: number, music_name: string, volume: number = 100) {
  AudioManager.playBgm({
    name: music_name,
    pos: 0,
    pan: 0,
    pitch: 100,
    volume: volume,
  });
}
