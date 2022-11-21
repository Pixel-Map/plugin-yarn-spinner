import { getItemIdFromName } from './utils';

export function addItem(args: Array<string>) {
  if (args.length != 2) {
    throw new Error('Invalid number of arguments');
  }
  $gameParty.gainItem($dataItems[getItemIdFromName(args[0])], parseInt(args[1]), false);
}
