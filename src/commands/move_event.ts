/**
 * Move an event
 * @example <<MoveEvent MovementMan down 4 0.25>>
 * @param direction_name - The direction to move the event in.  (up, down, left, right)
 * @param distance - The number of tiles to move the event
 * @param speed - The speed to move the event at.  Default of 0.25
 * @param eventName - The Name of the event to move (not ID!).  If not provided, defaults to the calling event
 * @remarks Event
 */
export function move_event(
  _callingEventId: number,
  direction_name: string,
  distance: number,
  speed: number = 0.25,
  eventName: string,
) {
  const targetEventId = eventName ? getEventIdByName(eventName) : _callingEventId;
  const event = $gameMap._events[targetEventId];

  const direction: DIRECTION = DIRECTION[direction_name.toUpperCase() as keyof typeof DIRECTION];

  // Force through other events, otherwise it's really inconsistent
  event.setThrough(true);

  if (event.isMoving()) {
    setTimeout(() => {
      move_event(_callingEventId, direction_name, distance, speed, eventName);
    }, 60);
  } else {
    event.moveStraight(direction);
    const distanceRemaining = distance - 1;
    setTimeout(() => {
      event.setThrough(false);
      if (distanceRemaining > 0) {
        move_event(_callingEventId, direction_name, distanceRemaining, speed, eventName);
      }
    }, 60);
  }
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION } from '../enums';
import { getEventIdByName } from '../utils';
