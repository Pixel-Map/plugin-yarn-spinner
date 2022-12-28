import { getEventIdByName } from './utils';
import { DIRECTION } from './enums';

/**
 * Move an event
 * @example <<MoveEvent MovementMan down 4 0.25>>
 */
export function moveEvent(args: Array<string>) {
  if (args.length != 4) {
    throw new Error('Invalid number of arguments');
  }
  const eventName = args[0];
  const direction: DIRECTION = DIRECTION[args[1].toUpperCase() as keyof typeof DIRECTION];
  const distance = parseInt(args[2]);
  // const speed = args[3];
  const event = $gameMap._events[getEventIdByName(eventName)];

  // Force through other events, otherwise it's really inconsistent
  event.setThrough(true);

  if (event.isMoving()) {
    setTimeout(() => {
      moveEvent(args);
    }, 60);
  } else {
    event.moveStraight(direction);
    const distanceRemaining = distance - 1;
    setTimeout(() => {
      event.setThrough(false);
      if (distanceRemaining > 0) {
        moveEvent([args[0], args[1], distanceRemaining.toString(), args[3]]);
      }
    }, 60);
  }
}
