export async function wait(_callingEventId: number, duration: number) {
  await new Promise((r) => setTimeout(r, duration));
}
