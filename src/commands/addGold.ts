export function addGold(args: Array<string>) {
  if (args.length != 1) {
    throw new Error('Invalid number of arguments');
  }
  $gameParty.gainGold(parseInt(args[0]));
}
