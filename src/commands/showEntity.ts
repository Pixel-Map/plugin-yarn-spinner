import { getEventIdByName } from './utils';

export function showEntity(args: Array<string>) {
  if (args.length > 2) {
    throw new Error('Invalid number of arguments');
  }

  let opacity = 1;
  if (args.length > 1) {
    opacity = parseFloat(args[1]);
  }
  const gameEvent = $gameMap.event(getEventIdByName(args[0]));
  console.log(args);

  if (opacity > 1) {
    throw new Error('Opacity greater than 1, please use a value between 0 and 1');
  }
  if (opacity < 0) {
    throw new Error('Opacity less than 0, please use a value between 0 and 1');
  }

  const opacityInHexFormat = opacity * 255; // 255 is fully opaque
  console.log(opacity);
  gameEvent.setOpacity(opacityInHexFormat);
}
