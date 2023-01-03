import { add_gold } from './add_gold';
import { add_item } from './add_item';
import { change_weather } from './change_weather';
import { fade_in } from './fade_in';
import { fade_out } from './fade_out';
import { flash_screen } from './flash_screen';
import { hide_event } from './hide_event';
import { move_event } from './move_event';
import { play_music } from './play_music';
import { play_sound } from './play_sound';
import { remove_gold } from './remove_gold';
import { remove_item } from './remove_item';
import { set_background } from './set_background';
import { set_facing } from './set_facing';
import { set_level } from './set_level';
import { show_balloon } from './show_balloon';
import { show_event } from './show_event';
import { stop_music } from './stop_music';
import { sync_move_event } from './sync_move_event';
import { teleport_event } from './teleport_event';
import { wait } from './wait';

export const commands = {
  add_item: add_item,
  add_gold: add_gold,
  change_weather: change_weather,
  fade_out: fade_out,
  fade_in: fade_in,
  flash_screen: flash_screen,
  hide_event: hide_event,
  move_event: move_event,
  play_music: play_music,
  play_sound: play_sound,
  remove_item: remove_item,
  remove_gold: remove_gold,
  set_facing: set_facing,
  set_level: set_level,
  show_balloon: show_balloon,
  show_event: show_event,
  stop_music: stop_music,
  teleport_event: teleport_event,
  wait: wait,
  set_background: set_background,
  sync_move_event: sync_move_event,
};

function isNum(value: string) {
  return /^\d+$/.test(value);
}

export async function getCommand(command: keyof typeof commands, args: any, callingEventId: number) {
  if (commands[command]) {
    for (let i = 0; i < args.length; i++) {
      if (isNum(args[i])) {
        args[i] = parseInt(args[i]);
      }
    }
    // @ts-ignore
    return (await commands[command](callingEventId, ...args)) as unknown as Function;
  }
  throw new Error('Invalid command, cannot find: ' + command);
}
