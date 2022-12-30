/**
 * Given a min and max, return a random number between them.
 * @param min - The minimum number to return.
 * @param max - The maximum number to return.
 * @returns A random number between min and max.
 */
export function random_range(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
