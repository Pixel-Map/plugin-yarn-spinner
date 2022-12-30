import { getEventIdByName } from './utils';

export function show_entity(_callingEventId: number, entityName: string, opacity = 1.0) {
  if (arguments.length > 1) {
    // @ts-ignore
    opacity = parseFloat(opacity);
  }
  const targetEventId = entityName != undefined ? getEventIdByName(entityName) : _callingEventId;
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
