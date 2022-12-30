export function flash_screen(_callingEventId: number, duration = 8, red = 0, green = 0, blue = 0, intensity = 255) {
  $gameScreen.startFlash([red, green, blue, intensity], duration);
}
