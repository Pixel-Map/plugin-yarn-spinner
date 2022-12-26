export function removeGold(args: Array<string>) {
  if (args.length != 1) {
    throw new Error('Invalid number of arguments');
  }
  $gameParty.loseGold(parseInt(args[0]));
}
