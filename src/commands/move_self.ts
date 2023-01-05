/**
 * Move calling event
 * @example <<move_self down 4 0.25>>
 * @param direction_name - The direction to move the event in.  (up, down, left, right)
 * @param distance - The number of tiles to move the event
 * @param speed - The speed to move the event at.  Default of 0.25
 * @remarks Event
 */
export async function move_self(
  _callingEventId: number,
  direction_name: keyof DIRECTION,
  distance: number,
  speed: number = 0.25,
) {

  const event = $gameMap._events[_callingEventId];
  return moveEntity(_callingEventId, direction_name, distance, speed, event, false);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION } from '../enums';
import { moveEntity } from '../utils';
