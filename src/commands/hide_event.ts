/**
 * Hides the entity with the given name.  If no entity provided, hides the calling entity
 * @param entity_name - Name of the event to hide.  NOT the ID!
 * @remarks Event
 */
export function hide_event(_callingEventId: number, entity_name: string) {
  // If no entity passed in, default to the entity that called hideEntity
  const targetEventId = entity_name != undefined ? getEventIdByName(entity_name) : _callingEventId;
  const gameEvent = $gameMap.event(targetEventId);

  gameEvent.setOpacity(0);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { getEventIdByName } from '../utils';
