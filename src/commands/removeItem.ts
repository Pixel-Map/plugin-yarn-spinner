import { getItemIdFromName } from './utils';

export function removeItem(_callingEventId: number, itemName: string, amount = 1) {
  $gameParty.loseItem($dataItems[getItemIdFromName(itemName)], amount, false);
}
