/**
 * Flash the screen (to white, or optionally to a color)
 * @param duration - Length of time for fade-out duration, default of 24 frames
 * @param red - Red value of the color to fade to, default of 0 (0-255 range)
 * @param green - Green value of the color to fade to, default of 0 (0-255 range)
 * @param blue - Blue value of the color to fade to, default of 0 (0-255 range)
 * @param intensity - How intense should the flash be?  Default of 255, which is maximum intensity.
 */
export function flash_screen(
  _callingEventId: number,
  duration: number = 8,
  red: number = 0,
  green: number = 0,
  blue: number = 0,
  intensity: number = 255,
) {
  $gameScreen.startFlash([red, green, blue, intensity], duration);
}
