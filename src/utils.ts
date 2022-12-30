export function getItemIdFromName(itemName: string): number {
  for (const item of $dataItems) {
    if (item && item.name === itemName) {
      return item.id;
    }
  }
  throw 'Item could not be found by name';
}

export function getEventIdByName(name: string): number {
  for (const event of $dataMap.events) {
    if (event?.name == name) {
      return event.id;
    }
  }
  throw new Error('Could not locate an event with name: ' + name);
}
