import { getEventIdByName } from './utils';

export function hideEntity(args: Array<string>) {
  const gameEvent = $gameMap.event(getEventIdByName(args[0]));
  gameEvent.setOpacity(0);
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }
}
