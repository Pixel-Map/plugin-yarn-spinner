export function playerHasItemByName(itemName: string) {
  for (const item of $dataItems) {
    if (item && item.name === itemName) {
      return $gameParty.hasItem(item, true);
    }
  }
  return false;
}
