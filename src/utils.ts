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

export function getMapIdByName(name: string): number {
  for (const map of $dataMapInfos) {
    if (map?.name == name) {
      // @ts-ignore
      return map.id;
    }
  }
  throw new Error('Could not locate a map with name: ' + name);
}

export function getEnumKeyByEnumValue(myEnum: any, enumValue: number | string): string {
  let keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : '';
}
