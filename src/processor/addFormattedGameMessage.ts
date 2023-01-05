import { wrap } from '../wrap';
import { updateCharacterPortrait } from './updateCharacterPortrait';

let callBackAfterMessageClose = () => {};
Window_Base.prototype.updateClose = function () {
  // @ts-ignore
  if (this._closing) {
    // @ts-ignore
    this.openness -= 32;
    // @ts-ignore
    if (this.isClosed()) {
      // @ts-ignore
      this._closing = false;
    }
    // @ts-ignore
    if (!this._closing) callBackAfterMessageClose();
  }
};

export async function addFormattedGameMessage(currentResult: any) {
  return new Promise<void>((resolve) => {
    updateCharacterPortrait(currentResult);
    if (currentResult.text.trim().length > 0) {
      let text = currentResult.text;

      // Add Special Color
      const special = currentResult.markup.find((markup: { name: string }) => {
        return markup.name === 'special';
      });
      if (special) {
        text =
          currentResult.text.slice(0, special.position) +
          '\\C[1]' +
          currentResult.text.slice(special.position, special.position + special.length) +
          '\\C[0]' +
          currentResult.text.slice(special.position + special.length);
      }
      callBackAfterMessageClose = () => {
        callBackAfterMessageClose = () => {};
        resolve();

      };
      $gameMessage.add(wrap(text, { width: 58 }));
    }
  });
}
