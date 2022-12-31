/**
 * Adds an item with the provided name to the player's inventory, with an optional quantity.
 * @param item_name - Name of the item to add (NOT id!)
 * @param quantity - The quantity of the item to add, default of 1.
 * @remarks Player
 */
export function add_item(_callingEventId: number, item_name: string, quantity: number = 1) {
  $gameParty.gainItem($dataItems[getItemIdFromName(item_name)], quantity, false);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { getItemIdFromName } from '../utils';
