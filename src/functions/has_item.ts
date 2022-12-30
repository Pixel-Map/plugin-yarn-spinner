/**
 * Returns true if the player has the specified item.
 * @param itemName - The name of the item to check for (NOT ID!)
 * @returns True if the player has the item, false otherwise.
 */

export function has_item(itemName: string) {
  return playerHasItemByName(itemName);
}

import { playerHasItemByName } from '../playerHasItemByName';
