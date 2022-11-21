export function getItemIdFromName(itemName: string): number {
  for (const item of $dataItems) {
    if (item && item.name === itemName) {
      return item.id;
    }
  }
  throw 'Item could not be found by name';
}
