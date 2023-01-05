/**
 * Changes the direction the calling event is facing.
 * @param direction - The direction to face (up, down, left, right)
 * @remarks Event
 */
export function set_self_facing(_callingEventId: number, direction: keyof DIRECTION) {
  const parsedDirection: DIRECTION = DIRECTION[direction as keyof typeof DIRECTION];
  $gameMap._events[_callingEventId].setDirection(parsedDirection);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION } from '../enums';
