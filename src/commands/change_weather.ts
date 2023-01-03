/**
 * Changes the weather to the specified weather type, with optional intensity and number of frames to blend in.
 * @param weather_type - The type of weather.  (none, rain, storm, snow)
 * @param intensity - On a scale of 1-9, defaults to 4
 * @param duration - Number of frames to blend in, defaults to 24
 * @remarks Camera
 */

export function change_weather(
  _callingEventId: number,
  weather_type: string,
  intensity: number = 4,
  duration: number = 24,
) {
  $gameScreen.changeWeather(weather_type, intensity, duration);
}
