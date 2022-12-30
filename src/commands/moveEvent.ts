import { DIRECTION } from './enums';
import { getEventIdByName } from './utils';

/**
 * Move an event
 * @example <<MoveEvent MovementMan down 4 0.25>>
 */
export function moveEvent(
  _callingEventId: number,
  directionName: string,
  distance: number,
  speed = 0.25,
  eventName: string,
) {
  const targetEventId = eventName ? getEventIdByName(eventName) : _callingEventId;
  const event = $gameMap._events[targetEventId];

  const direction: DIRECTION = DIRECTION[directionName.toUpperCase() as keyof typeof DIRECTION];

  // Force through other events, otherwise it's really inconsistent
  event.setThrough(true);

  if (event.isMoving()) {
    setTimeout(() => {
      moveEvent(_callingEventId, directionName, distance, speed, eventName);
    }, 60);
  } else {
    event.moveStraight(direction);
    const distanceRemaining = distance - 1;
    setTimeout(() => {
      event.setThrough(false);
      if (distanceRemaining > 0) {
        moveEvent(_callingEventId, directionName, distanceRemaining, speed, eventName);
      }
    }, 60);
  }
}
