import { getItemIdFromName } from './utils';

export function removeItem(args: Array<string>) {
  if (args.length != 2) {
    throw new Error('Invalid number of arguments');
  }
  $gameParty.loseItem($dataItems[getItemIdFromName(args[0])], parseInt(args[1]), false);
}
