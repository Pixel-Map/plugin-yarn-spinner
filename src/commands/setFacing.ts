import { DIRECTION } from './enums';
import { getEventIdByName } from './utils';

export function setFacing(args: Array<string>, _callingEventId: number) {
  if (args.length < 1 || args.length > 2) {
    throw new Error('Invalid number of arguments');
  }
  const targetEventId = args[1] ? getEventIdByName(args[1]) : _callingEventId;
  const direction: DIRECTION = DIRECTION[args[0].toUpperCase() as keyof typeof DIRECTION];
  $gameMap._events[targetEventId].setDirection(direction);
}
