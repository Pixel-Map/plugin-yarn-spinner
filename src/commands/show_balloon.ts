/**
 * Shows a balloon icon above an event.  Defaults to the calling event.  Can optionally pass in "player"for event_name if you'd like it to appear above the player.
   @param balloon_type - The type of balloon to show.  (exclamation, question, music_note, heart, anger, sweat, frustration, silence, light_bulb, zzz)
 * @param event_name - The name of the event to show (not ID!).  If not provided, defaults to the calling event, or the player if "player" is specified.
 * @remarks Event
 */
export function show_balloon(_callingEventId: number, balloon_type: keyof BALLOON_TYPE, event_name: string) {
  if (event_name == 'player') {
    // @ts-ignore
    $gameTemp.requestBalloon($gamePlayer, BALLOON_TYPE[balloon_type as keyof typeof BALLOON_TYPE]);
  } else if (event_name == undefined) {
    // @ts-ignore
    $gameTemp.requestBalloon(
      $gameMap._events[_callingEventId],
      BALLOON_TYPE[balloon_type as keyof typeof BALLOON_TYPE],
    );
  } else {
    const targetEventId = getEventIdByName(event_name);
    // @ts-ignore
    $gameTemp.requestBalloon($gameMap._events[targetEventId], BALLOON_TYPE[balloon_type as keyof typeof BALLOON_TYPE]);
  }
}

// Imports have to be on bottom because of ridiculous TSDoc bug https://github.com/TypeStrong/typedoc/issues/603
import { BALLOON_TYPE } from '../enums';
import { getEventIdByName } from '../utils';
