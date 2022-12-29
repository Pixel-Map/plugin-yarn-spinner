import { getEventIdByName } from './utils';

export function hideEntity(args: Array<string>, _callingEventId: number) {
  // Input Validation
  if (args.length > 1) {
    throw new Error('Invalid number of arguments');
  }

  // If no entity passed in, default to the entity that called hideEntity
  const targetEventId = getEventIdByName(args[0]) ?? _callingEventId;
  const gameEvent = $gameMap.event(targetEventId);

  gameEvent.setOpacity(0);
}
