import { addItem } from './addItem';
import { fadeIn } from './fadeIn';
import { fadeOut } from './fadeOut';
import { removeItem } from './removeItem';
import { setBackground } from './setBackground';
import { wait } from './wait';

export const commands = {
  AddItem: addItem,
  FadeOut: fadeOut,
  FadeIn: fadeIn,
  RemoveItem: removeItem,
  Wait: wait,
  SetBackground: setBackground,
};

export function getCommand(command: keyof typeof commands, args: any) {
  if (commands[command]) {
    return commands[command](args) as unknown as Function;
  }
  throw new Error('Invalid command');
}
