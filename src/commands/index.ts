import { addGold } from './addGold';
import { addItem } from './addItem';
import { fadeIn } from './fadeIn';
import { fadeOut } from './fadeOut';
import { moveEvent } from './moveEvent';
import { playMusic } from './playMusic';
import { playSound } from './playSound';
import { removeGold } from './removeGold';
import { removeItem } from './removeItem';
import { setBackground } from './setBackground';
import { setFacing } from './setFacing';
import { wait } from './wait';

export const commands = {
  AddItem: addItem,
  AddGold: addGold,
  FadeOut: fadeOut,
  FadeIn: fadeIn,
  MoveEvent: moveEvent,
  PlayMusic: playMusic,
  PlaySound: playSound,
  RemoveItem: removeItem,
  RemoveGold: removeGold,
  SetFacing: setFacing,
  Wait: wait,
  SetBackground: setBackground,
};

export function getCommand(command: keyof typeof commands, args: any, callingEventId: number) {
  if (commands[command]) {
    return commands[command](args, callingEventId) as unknown as Function;
  }
  throw new Error('Invalid command');
}
