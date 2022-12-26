import { addItem } from './addItem';
import { fadeIn } from './fadeIn';
import { fadeOut } from './fadeOut';
import { removeItem } from './removeItem';
import { setBackground } from './setBackground';
import { wait } from './wait';
import { playSound } from './playSound';
import { playMusic } from './playMusic';
import { moveEvent } from './moveEvent';
import { addGold } from './addGold';
import { removeGold } from './removeGold';

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
  Wait: wait,
  SetBackground: setBackground,
};

export function getCommand(command: keyof typeof commands, args: any) {
  console.log(command);
  if (commands[command]) {
    return commands[command](args) as unknown as Function;
  }
  throw new Error('Invalid command');
}
