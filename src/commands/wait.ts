export async function wait(args: Array<any>) {
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
  await new Promise((r) => setTimeout(r, parseInt(args[0])));
}
