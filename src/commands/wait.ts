/**
 * Waits for a given amount of time.
 * @param duration - The amount of time to wait in frames
 */
export async function wait(_callingEventId: number, duration: number) {
  await new Promise((r) => setTimeout(r, duration));
}
