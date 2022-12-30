/**
 * Plays a sound file
 * @param sound_name - Name of the sound file to play
 * @param volume - Volume to play it at, defaults to full volume (100)
 */
export function play_sound(_callingEventId: number, sound_name: string, volume: number = 100) {
  AudioManager.playSe({
    name: sound_name,
    pan: 0,
    pitch: 100,
    volume: volume,
    pos: 0,
  });
}
