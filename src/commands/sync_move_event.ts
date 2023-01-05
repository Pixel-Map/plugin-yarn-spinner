/**
 * Move an event (Same as move_event, except blocks script execution until movement is complete)
 * @example <<sync_move MovementMan down 4 0.25>>
 * @param event_name - The Name of the event to move (not ID!).
 * @param direction_name - The direction to move the event in.  (up, down, left, right)
 * @param distance - The number of tiles to move the event
 * @param speed - The speed to move the event at.  Default of 0.25
 * @remarks Event
 */
export async function sync_move_event(
  _callingEventId: number,
  event_name: string,
  direction_name: keyof DIRECTION,
  distance: number,
  speed: number = 0.25,
) {
  const targetEventId = getEventIdByName(event_name);
  const event = $gameMap._events[targetEventId];
  return moveEntity(_callingEventId, direction_name, distance, speed, event, true);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION } from '../enums';
import { getEventIdByName, moveEntity } from '../utils';
