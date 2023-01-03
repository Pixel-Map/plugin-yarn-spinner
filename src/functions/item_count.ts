/**
 * Returns the number of the given item the player has.
 * @param itemName - The name of the item to check for (NOT ID!)
 * @returns Number of the given item the player has.
 */
import { getItemIdFromName } from '../utils';

export function item_count(itemName: string) {
  const itemId = getItemIdFromName(itemName);
  return $gameParty.numItems($dataItems[itemId]);
}
