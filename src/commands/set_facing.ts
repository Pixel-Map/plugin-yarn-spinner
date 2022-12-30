import { DIRECTION } from './enums';
import { getEventIdByName } from './utils';

export function set_facing(_callingEventId: number, direction: string, eventName: string) {
  const targetEventId = eventName != undefined ? getEventIdByName(eventName) : _callingEventId;
  const parsedDirection: DIRECTION = DIRECTION[direction.toUpperCase() as keyof typeof DIRECTION];
  $gameMap._events[targetEventId].setDirection(parsedDirection);
}
