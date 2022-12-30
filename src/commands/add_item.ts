import { getItemIdFromName } from './utils';

export function add_item(_callingEventId: number, itemName: string, quantity = 1) {
  $gameParty.gainItem($dataItems[getItemIdFromName(itemName)], quantity, false);
}
