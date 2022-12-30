import { getEventIdByName } from './utils';

export function hide_entity(_callingEventId: number, entityName: string) {
  // If no entity passed in, default to the entity that called hideEntity
  const targetEventId = entityName != undefined ? getEventIdByName(entityName) : _callingEventId;
  const gameEvent = $gameMap.event(targetEventId);

  gameEvent.setOpacity(0);
}
