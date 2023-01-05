/**
 * Teleports an event to the specified x and y.  If no event name specified, defaults to the calling event.
 * @param x - The x coordinate to teleport the event to.
 * @param y - The y coordinate to teleport the event to.
 * @remarks Teleport
 */
export function teleport_self(_callingEventId: number, x: number, y: number) {
  const targetEventId = _callingEventId;
  const event = $gameMap._events[targetEventId];
  event.setPosition(x, y);
}

