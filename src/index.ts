// @ts-ignore
import YarnBound from 'yarn-bound';
import { playerHasItemByName } from './playerHasItemByName';
import { YarnNodeType } from './types';
import { wrap } from './wrap';
// import { MMO_Core_Player } from '../mmoCore';
// import { buyHouse } from '../pixelmapHouses';

console.log('Moogle');
const MAX_DIALOG_EXHAUSTION = 3;

PluginManager.registerCommand('pixelmapYarnSpinner', 'yarn', (args) => {
  console.log('HRRDLY');
  return fetch(args['Yarn File Path']).then((response) => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status); // Rejects the promise
    }
    const prefix = args['Yarn File Path'].split('.')[0].replace('dialog/', '');
    const startAt = args['Start At'];
    response.text().then((dialogue) => {
      yarnSpinnerProcesser(prefix, dialogue, startAt);
    });
  });
});

export async function yarnSpinnerProcesser(prefix: string, dialogue: string, startAt: string) {
  const variableStorage = new VariableStorage(prefix);

  // Stardew Mode is heavily opinionated, and based on https://stardewvalleywiki.com/Modding:Dialogue
  if (startAt == 'StardewMode') {
    startAt = getStardewModeNode(variableStorage, dialogue);
  }

  const runner = new YarnBound({
    dialogue,
    startAt: startAt,
    functions: {
      random_range: (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },
      playerHasItem: (value: string) => {
        return playerHasItemByName(value);
      },
    },
    variableStorage: variableStorage,
  });

  await processYarnDialog(runner);
}

function getStardewModeNode(variableStorage: VariableStorage, dialogue: string) {
  // Holiday / Special Events

  // Process Exhaustion
  let exhaustion: number = variableStorage.getExhaustion();
  if (!exhaustion) {
    exhaustion = 0;
  }
  if (exhaustion >= MAX_DIALOG_EXHAUSTION) {
    return getRandomNodeOfType(YarnNodeType.Exhausted, dialogue);
  }
  variableStorage.set('dialog_exhaustion', exhaustion + 1);

  // Have we already met the character?
  const introduced = variableStorage.get('introduced');
  if (!introduced) {
    variableStorage.set('introduced', true);
    return 'Start';
  }

  // If nothing else matches, grab one of the Anytime nodes
  return getRandomNodeOfType(YarnNodeType.Anytime, dialogue);
}

function getNodes(dialogue: string) {
  // Create Temporary Runner for lookups
  const tempRunner = new YarnBound({
    dialogue,
  });
  return Object.entries(tempRunner.runner.yarnNodes);
}

function getRandomNodeOfType(type: YarnNodeType, dialogue: string) {
  const nodes = getNodes(dialogue);
  const filtered = nodes.filter((node) => {
    return node[0].includes(type);
  });
  return filtered[Math.floor(Math.random() * filtered.length)][0];
}

async function processYarnDialog(runner: YarnBound) {
  const currentResult = runner.currentResult;
  switch (currentResult.constructor) {
    case YarnBound.TextResult:
      // Set the portrait to the name speaking
      const character = currentResult.markup.find((markup: { name: string }) => {
        return markup.name === 'character';
      });
      if (character) {
        $gameMessage.setFaceImage(character.properties.name.toLowerCase(), 0);
      }

      // var charName = $gameActors.actor(1).name();
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
        $gameMessage.add(wrap(text, { width: 58 }));
      }
      if (!currentResult.isDialogueEnd) {
        if (currentResult.text.trim().length > 0) {
          // $gameMessage.newPage();
        }
        runner.advance();
        await processYarnDialog(runner);
      }
      break;
    case YarnBound.OptionsResult:
      const choices = []; // Because some choices may NOT be available, the index within the choices array does
      const choiceIndexMap = {}; // not always match the index in yarn.  Because of that, we store the position
      let arrayIndex = 0; // of each option in BOTH arrays within a dictionary, so we can reference them in
      let yarnIndex = 0; // the callback.
      for (const option of currentResult.options) {
        if (option.isAvailable) {
          // @ts-ignore
          choices.push(option.text);
          // @ts-ignore
          choiceIndexMap[arrayIndex] = yarnIndex;
          arrayIndex = arrayIndex + 1;
        }
        yarnIndex = yarnIndex + 1;
      }

      $gameMessage.setChoices(choices, 0, 0);

      $gameMessage.setChoiceCallback(async (responseIndex) => {
        // @ts-ignore
        runner.advance(choiceIndexMap[responseIndex]);
        await processYarnDialog(runner);
      });
      break;
    case YarnBound.CommandResult:
      await commandHandler(currentResult);
      if (!currentResult.isDialogueEnd) {
        runner.advance();
        await processYarnDialog(runner);
      }
  }
}

async function commandHandler(cmdResult: YarnBound.CommandResult) {
  // This matcher splits by spaces, but ignores spaces within quotes
  const splitCmd = cmdResult.command.match(/\\?.|^$/g).reduce(
    (p: { quote: number; a: any[] }, c: string) => {
      if (c === '"') {
        // eslint-disable-next-line no-bitwise
        p.quote ^= 1;
      } else if (!p.quote && c === ' ') {
        p.a.push('');
      } else {
        p.a[p.a.length - 1] += c.replace(/\\(.)/, '$1');
      }
      return p;
    },
    { a: [''] },
  ).a;

  const cmd = splitCmd[0];
  switch (cmd) {
    case 'FadeOut':
      if (splitCmd.length == 2) {
        // @ts-ignore
        SceneManager._scene._active = false;
        $gameScreen.startFadeOut(splitCmd[1] ? splitCmd[1] : 24);
      } else {
        console.log('Invalid argument number passed into FadeOut!');
      }
      break;
    case 'FadeIn':
      if (splitCmd.length == 2) {
        $gameScreen.startFadeIn(splitCmd[1] ? splitCmd[1] : 24);
        // @ts-ignore
        SceneManager._scene._active = true;
      } else {
        console.log('Invalid argument number passed into FadeOut!');
      }
      break;
    case 'Wait':
      if (splitCmd.length == 2) {
        await new Promise((r) => setTimeout(r, parseInt(splitCmd[1])));
      } else {
        console.log('Invalid argument number passed into Wait!');
      }
      break;
    case 'SetBackground':
      if (splitCmd.length == 2) {
        $gameMessage.setBackground(parseInt(splitCmd[1]));
      } else {
        console.log('Invalid argument number passed into SetBackground!');
      }
      break;
    case 'FadeToBlackAndBack':
      if (splitCmd.length == 2) {
        // @ts-ignore
        SceneManager._scene._active = false;
        $gameScreen.startFadeOut(30);
        await new Promise((r) => setTimeout(r, parseInt(splitCmd[1])));
        $gameScreen.startFadeIn(30);
        // @ts-ignore
        SceneManager._scene._active = true;
      } else {
        console.log('Invalid argument number passed into FadeToBlackAndBack!');
      }
      break;
    case 'AddItem':
      if (splitCmd.length == 3) {
        $gameParty.gainItem($dataItems[getItemIdFromName(splitCmd[1])], parseInt(splitCmd[2]), false);
      } else {
        console.log('Invalid argument number passed into AddItem!');
      }
      break;
    case 'RemoveItem':
      if (splitCmd.length == 3) {
        $gameParty.loseItem($dataItems[getItemIdFromName(splitCmd[1])], parseInt(splitCmd[2]), false);
      } else {
        console.log('Invalid argument number passed into RemoveItem!');
      }
      break;
    case 'PlaySound':
      if (splitCmd.length == 3) {
        AudioManager.playSe({
          name: splitCmd[1],
          pan: 0,
          pitch: 100,
          volume: parseInt(splitCmd[2]),
          pos: 0,
        });
      } else {
        console.log('Invalid argument number passed into PlaySound!');
      }
      break;
    case 'PlayMusic':
      if (splitCmd.length == 1) {
        $gameSystem.replayBgm();
      } else if (splitCmd.length == 2) {
        AudioManager.playBgm({
          name: splitCmd[1],
          pos: 0,
          pan: 0,
          pitch: 100,
          volume: 100,
        });
      } else {
        console.log('Invalid argument number passed into PlaySound!');
      }
      break;
    case 'StopMusic':
      if (splitCmd.length == 1) {
        $gameSystem.saveBgm();
        AudioManager.fadeOutBgm(0);
      } else if (splitCmd.length == 2) {
        $gameSystem.saveBgm();
        AudioManager.fadeOutBgm(parseInt(splitCmd[1]));
      } else {
        console.log('Invalid argument number passed into PlaySound!');
      }
      break;
    // case 'BuyHouse':
    //   if (splitCmd.length == 1) {
    //     buyHouse();
    //   } else {
    //     console.log('Invalid argument number passed into PlaySound!');
    //   }
    //   break;
    default:
      console.log('No support yet for command: ' + cmd);
  }
}

function getItemIdFromName(itemName: string): number {
  for (const item of $dataItems) {
    if (item && item.name === itemName) {
      return item.id;
    }
  }
  throw 'Item could not be found by name';
}

class VariableStorage {
  storage: Map<string, unknown>;
  prefix: string;

  constructor(prefix: string) {
    // this.storage = MMO_Core_Player.mmoVariableStorage as Map<string, unknown>;
    this.storage = new Map<string, unknown>();
    this.prefix = prefix;
  }

  getExhaustion() {
    return this.storage.get(this.prefix + '_dialog_exhaustion') as number;
  }

  get(key: string) {
    if (key.startsWith('dynamic_')) {
      return getDynamicValue(key.replace('dynamic_', ''));
    }
    const retrievalKey = key.startsWith('global_') ? key : this.prefix + '_' + key;
    return this.storage.get(retrievalKey);
  }

  set(key: string, value: any) {
    const retrievalKey = key.startsWith('global_') ? key : this.prefix + '_' + key;
    this.storage.set(retrievalKey, value);
  }
}

function getDynamicValue(variableName: string): any {
  switch (variableName) {
    case 'playerOwnsTile':
      return true;
    // return MMO_Core_Player.playerOwnsNFT('0x050dc61dfb867e0fe3cf2948362b6c0f3faf790b');
    case 'playerOwnsHouse':
      return true;
    // return !!MMO_Core_Player.Player.house;
  }
}

// MonkeyPatch by Hudell, without this, it's impossible to call messages AFTER a choice callback
// https://forums.rpgmakerweb.com/index.php?threads/script-works-but-not-in-a-conditional-explanation-please.71461/
Window_ChoiceList.prototype.callOkHandler = function () {
  const callback = $gameMessage._choiceCallback;
  const index = this.index();

  // @ts-ignore
  this._messageWindow.terminateMessage();
  this.close();

  if (callback) {
    callback(index);
  }
};

Window_ChoiceList.prototype.callCancelHandler = function () {
  const callback = $gameMessage._choiceCallback;
  const index = $gameMessage.choiceCancelType();

  // @ts-ignore
  this._messageWindow.terminateMessage();
  this.close();

  if (callback) {
    callback(index);
  }
};
