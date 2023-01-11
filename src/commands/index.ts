import { add_gold } from './add_gold';
import { add_item } from './add_item';
import { change_weather } from './change_weather';
import { fade_in } from './fade_in';
import { fade_out } from './fade_out';
import { flash_screen } from './flash_screen';
import { hide_event } from './hide_event';
import { move_event } from './move_event';
import { move_self } from './move_self';
import { play_music } from './play_music';
import { play_sound } from './play_sound';
import { remove_gold } from './remove_gold';
import { remove_item } from './remove_item';
import { set_background } from './set_background';
import { set_facing } from './set_facing';
import { set_level } from './set_level';
import { set_self_facing } from './set_self_facing';
import { show_balloon } from './show_balloon';
import { show_event } from './show_event';
import { stop_music } from './stop_music';
import { sync_move_event } from './sync_move_event';
import { sync_move_self } from './sync_move_self';
import { teleport_event } from './teleport_event';
import { teleport_self } from './teleport_self';
import { wait } from './wait';

export const commands = new Map<string, Function>([
  ['add_item', add_item],
  ['add_gold', add_gold],
  ['change_weather', change_weather],
  ['fade_out', fade_out],
  ['fade_in', fade_in],
  ['flash_screen', flash_screen],
  ['hide_event', hide_event],
  ['move_event', move_event],
  ['move_self', move_self],
  ['play_music', play_music],
  ['play_sound', play_sound],
  ['remove_item', remove_item],
  ['remove_gold', remove_gold],
  ['set_facing', set_facing],
  ['set_level', set_level],
  ['show_balloon', show_balloon],
  ['show_event', show_event],
  ['stop_music', stop_music],
  ['teleport_event', teleport_event],
  ['teleport_self', teleport_self],
  ['set_background', set_background],
  ['set_self_facing', set_self_facing],
  ['sync_move_event', sync_move_event],
  ['sync_move_self', sync_move_self],
  ['wait', wait],
]);

function isNum(value: string) {
  return /^\d+$/.test(value);
}

/**
 * Add's a custom command to the command list, to make yarn-bound easily extensible.
 * @param commandName - The name of the command to add.
 * @param command - The function to execute when the command is called.
 */
export async function addCommand(commandName: string, command: Function) {
  if (commands.get(commandName)) {
    console.error(`Command ${commandName} already exists.  Skipping add.`);
  } else {
    commands.set(commandName, command);
  }
}

/**
 * Executes a command.
 * @param command
 * @param args
 * @param callingEventId
 */
export async function executeCommand(command: string, args: any, callingEventId: number) {
  if (commands.get(command)) {
    for (let i = 0; i < args.length; i++) {
      if (isNum(args[i])) {
        args[i] = parseInt(args[i]);
      }
    }
    // @ts-ignore
    return (await commands.get(command)(callingEventId, ...args)) as unknown as Function;
  }
  throw new Error('Invalid command, cannot find: ' + command);
}
