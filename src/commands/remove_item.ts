import { getItemIdFromName } from './utils';

export function remove_item(_callingEventId: number, itemName: string, amount = 1) {
  $gameParty.loseItem($dataItems[getItemIdFromName(itemName)], amount, false);
}
