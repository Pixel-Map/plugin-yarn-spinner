/**
 * Shows the event (if it's hidden).  If no event name provided, defaults to calling event.
 * @param event_name - The name of the event to show (not ID!).  If not provided, defaults to the calling event
 * @param opacity - The opacity to show the event at.  Defaults to 1 (fully visible)
 */
export function show_event(_callingEventId: number, event_name: string, opacity: number = 1.0) {
  if (arguments.length > 1) {
    // @ts-ignore
    opacity = parseFloat(opacity);
  }
  const targetEventId = event_name != undefined ? getEventIdByName(event_name) : _callingEventId;
  const gameEvent = $gameMap.event(targetEventId);

  if (opacity > 1) {
    throw new Error('Opacity greater than 1, please use a value between 0 and 1');
  }
  if (opacity < 0) {
    throw new Error('Opacity less than 0, please use a value between 0 and 1');
  }

  const opacityInHexFormat = opacity * 255; // 255 is fully opaque
  gameEvent.setOpacity(opacityInHexFormat);
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { getEventIdByName } from '../utils';
