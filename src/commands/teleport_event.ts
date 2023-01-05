/**
 * Teleports an event to the specified x and y.  If no event name specified, defaults to the calling event.
 * @param event_name - Name (NOT id!) of the event to teleport.
 * @param x - The x coordinate to teleport the event to.
 * @param y - The y coordinate to teleport the event to.
 * @remarks Teleport
 */
export function teleport_event(_callingEventId: number, event_name: string, x: number, y: number) {
  const targetEventId = getEventIdByName(event_name);
  const event = $gameMap._events[targetEventId];
  event.setPosition(x, y);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { getEventIdByName } from '../utils';
