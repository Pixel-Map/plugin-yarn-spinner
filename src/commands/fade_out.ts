/**
 * Fade out the screen (to black, or optionally to a color)
 * @param duration - Length of time for fade-out duration, default of 24 frames
 * @param red - Red value of the color to fade to, default of 0 (0-255 range)
 * @param green - Green value of the color to fade to, default of 0 (0-255 range)
 * @param blue - Blue value of the color to fade to, default of 0 (0-255 range)
 * @param grey - Greyness, default of 0 (0-100 range), 100 is fully black & white.
 * @param alpha - Alpha value of the color to fade to, default of 1 (0-1 range, 0.5 is half transparent)
 * @remarks Camera
 */
export function fade_out(
  _callingEventId: number,
  duration: number = 24,
  red: number = 0,
  green: number = 0,
  blue: number = 0,
  grey: number = 0,
  alpha: number = 1,
) {
  if (red === 0 && green === 0 && blue === 0 && grey === 0 && alpha === 1) {
    $gameScreen.startFadeOut(duration);
  } else {
    $gameScreen.startTint([red * alpha, green * alpha, blue * alpha, grey * alpha], duration);
  }
}
