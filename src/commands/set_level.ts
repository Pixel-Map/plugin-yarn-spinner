/**
 * Teleports the player to the specified map name, at a specific x and y.
 * @param map_name - Name (NOT id!) of the map to teleport the player to.
 * @param x - The x coordinate to teleport the player to.
 * @param y - The y coordinate to teleport the player to.
 * @param direction - The direction the player should face after teleporting, defaults to current player direction (up, down, left, right)
 * @param fade_type - The type of fade to use when teleporting, defaults to no_fade. (fade_black, fade_white, no_fade)
 * @remarks Teleport
 */
export function set_level(
  _callingEventId: number,
  map_name: string,
  x: number,
  y: number,
  direction: keyof DIRECTION = getEnumKeyByEnumValue(DIRECTION, $gamePlayer.direction()) as keyof DIRECTION,
  fade_type: keyof FADE_TYPE = 'no_fade' as keyof FADE_TYPE,
) {
  const parsedDirection: DIRECTION = DIRECTION[direction as keyof typeof DIRECTION];
  $gamePlayer.reserveTransfer(
    getMapIdByName(map_name),
    x,
    y,
    parsedDirection,
    FADE_TYPE[fade_type as keyof typeof FADE_TYPE],
  );
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { DIRECTION, FADE_TYPE } from '../enums';
import { getEnumKeyByEnumValue, getMapIdByName } from '../utils';
