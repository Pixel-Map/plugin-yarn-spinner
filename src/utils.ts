import { DIRECTION } from './enums';

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

export async function moveEntity(
  _callingEventId: number,
  direction_name: keyof DIRECTION,
  distance: number,
  speed: number,
  event_name: string,
  synchronous: boolean,
) {
  return new Promise<void>(async (finalResolve) => {
    if (!synchronous) {
      finalResolve();
    }
    let distanceTraveled = 0;
    while (distanceTraveled < distance) {
      await new Promise<void>(async function (resolve, _reject): Promise<void> {
        const targetEventId = event_name != undefined ? getEventIdByName(event_name) : _callingEventId;
        const event = $gameMap._events[targetEventId];

        const direction: DIRECTION = DIRECTION[direction_name as keyof typeof DIRECTION];

        // Don't start unless not moving
        await waitUntilNotMoving(event);

        // Force through other events, otherwise it's really inconsistent
        event.setThrough(true);
        event.setMoveSpeed(speed);
        event.moveStraight(direction);

        await new Promise((r) => setTimeout(r, 60));

        // Wait until done moving before continuing
        await waitUntilNotMoving(event);
        event.setThrough(false);
        resolve();
      });
      distanceTraveled++;
    }
    finalResolve();
  });
}

function waitUntilNotMoving(event: Game_Event) {
  return new Promise<void>(function (resolve, _reject) {
    if (event.isMoving()) {
      const interval = setInterval(function () {
        if (!event.isMoving()) {
          clearInterval(interval);
          resolve();
        }
      }, 60);
    } else {
      resolve();
    }
  });
}
