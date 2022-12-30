import { getItemIdFromName } from './utils';

export function addItem(_callingEventId: number, itemName: string, quantity = 1) {
  $gameParty.gainItem($dataItems[getItemIdFromName(itemName)], quantity, false);
}
