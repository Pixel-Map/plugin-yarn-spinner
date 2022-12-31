/**
 * Changes the direction the provided event name is facing.  If no event name is provided, defaults to the calling event.
 * @param direction - The direction to face (up, down, left, right)
 * @param event_name - The name of the event to face (not ID!).  If not provided, defaults to the calling event
 * @remarks Event
 */
export function set_facing(_callingEventId: number, direction: string, event_name: string) {
  const targetEventId = event_name != undefined ? getEventIdByName(event_name) : _callingEventId;
  const parsedDirection: DIRECTION = DIRECTION[direction.toUpperCase() as keyof typeof DIRECTION];
  $gameMap._events[targetEventId].setDirection(parsedDirection);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION } from '../enums';
import { getEventIdByName } from '../utils';
