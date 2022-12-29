import { DIRECTION } from './enums';
import { getEventIdByName } from './utils';

/**
 * Move an event
 * @example <<MoveEvent MovementMan down 4 0.25>>
 */
export function moveEvent(args: Array<string>, _callingEventId: number) {
  if (args.length < 3 || args.length > 4) {
    throw new Error('Invalid number of arguments');
  }

  const [directionName, distanceAsStr, speed, eventName = null] = args;
  const targetEventId = eventName ? getEventIdByName(eventName) : _callingEventId;
  const event = $gameMap._events[targetEventId];

  const distance = parseInt(distanceAsStr);
  const direction: DIRECTION = DIRECTION[directionName.toUpperCase() as keyof typeof DIRECTION];

  // Force through other events, otherwise it's really inconsistent
  event.setThrough(true);

  if (event.isMoving()) {
    setTimeout(() => {
      moveEvent(args, _callingEventId);
    }, 60);
  } else {
    event.moveStraight(direction);
    const distanceRemaining = distance - 1;
    setTimeout(() => {
      event.setThrough(false);
      if (distanceRemaining > 0) {
        moveEvent([args[0], distanceRemaining.toString(), speed, args[3]], _callingEventId);
      }
    }, 60);
  }
}
