/**
 * Teleports an event to the specified x and y.  If no event name specified, defaults to the calling event.
 * @param x - The x coordinate to teleport the event to.
 * @param y - The y coordinate to teleport the event to.
 * @param event_name - Name (NOT id!) of the event to teleport.  Defaults to calling event.
 * @remarks Teleport
 */
export function teleport_event(_callingEventId: number, x: number, y: number, event_name: string) {
  const targetEventId = event_name != undefined ? getEventIdByName(event_name) : _callingEventId;
  const event = $gameMap._events[targetEventId];
  event.setPosition(x, y);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { getEventIdByName } from '../utils';
