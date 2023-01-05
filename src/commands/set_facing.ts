/**
 * Changes the direction the provided event name is facing.
 * @param direction - The direction to face (up, down, left, right)
 * @param event_name - The name of the event to face (not ID!).  If not provided, defaults to the calling event
 * @remarks Event
 */
export function set_facing(_callingEventId: number, event_name: string, direction: keyof DIRECTION) {
  const targetEventId = getEventIdByName(event_name);
  const parsedDirection: DIRECTION = DIRECTION[direction as keyof typeof DIRECTION];
  $gameMap._events[targetEventId].setDirection(parsedDirection);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION } from '../enums';
import { getEventIdByName } from '../utils';
