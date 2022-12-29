import { addGold } from './addGold';
import { addItem } from './addItem';
import { fadeIn } from './fadeIn';
import { fadeOut } from './fadeOut';
import { flashScreen } from './flashScreen';
import { hideEntity } from './hideEntity';
import { moveEvent } from './moveEvent';
import { playMusic } from './playMusic';
import { playSound } from './playSound';
import { removeGold } from './removeGold';
import { removeItem } from './removeItem';
import { setBackground } from './setBackground';
import { setFacing } from './setFacing';
import { showEntity } from './showEntity';
import { wait } from './wait';

export const commands = {
  add_item: addItem,
  add_gold: addGold,
  fade_out: fadeOut,
  fade_in: fadeIn,
  flash_screen: flashScreen,
  hide_entity: hideEntity,
  move_event: moveEvent,
  play_music: playMusic,
  play_sound: playSound,
  remove_item: removeItem,
  remove_gold: removeGold,
  set_facing: setFacing,
  show_entity: showEntity,
  wait: wait,
  set_background: setBackground,
};

export function getCommand(command: keyof typeof commands, args: any, callingEventId: number) {
  if (commands[command]) {
    return commands[command](args, callingEventId) as unknown as Function;
  }
  throw new Error('Invalid command');
}
