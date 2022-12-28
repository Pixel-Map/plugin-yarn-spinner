import { addGold } from './addGold';
import { addItem } from './addItem';
import { fadeIn } from './fadeIn';
import { fadeOut } from './fadeOut';
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
  AddItem: addItem,
  AddGold: addGold,
  FadeOut: fadeOut,
  FadeIn: fadeIn,
  HideEntity: hideEntity,
  MoveEvent: moveEvent,
  PlayMusic: playMusic,
  PlaySound: playSound,
  RemoveItem: removeItem,
  RemoveGold: removeGold,
  SetFacing: setFacing,
  ShowEntity: showEntity,
  Wait: wait,
  SetBackground: setBackground,
};

export function getCommand(command: keyof typeof commands, args: any, callingEventId: number) {
  if (commands[command]) {
    return commands[command](args, callingEventId) as unknown as Function;
  }
  throw new Error('Invalid command');
}
