import { getItemIdFromName } from './utils';

export function addItem(args: Array<string>) {
  if (args.length < 1 || args.length > 2) {
    throw new Error('Invalid number of arguments');
  }
  const [itemName, quantity = '1'] = args;
  $gameParty.gainItem($dataItems[getItemIdFromName(itemName)], parseInt(quantity), false);
}
