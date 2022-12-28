import { DIRECTION } from './enums';

export function setFacing(args: Array<string>, _callingEventId: number) {
  if (args.length != 1) {
    throw new Error('Invalid number of arguments');
  }
  const direction: DIRECTION = DIRECTION[args[0].toUpperCase() as keyof typeof DIRECTION];
  $gameMap._events[_callingEventId].setDirection(direction);
}
