// @ts-ignore
import YarnBound from 'yarn-bound';
import { playerHasItemByName } from './playerHasItemByName';
import { YarnNodeType } from './types';
import { wrap } from './wrap';
import { splitSpacesExcludeQuotes } from './split-spaces-exclude-quotes';

import { getCommand } from './commands';
// import { MMO_Core_Player } from '../mmoCore';
// import { buyHouse } from '../pixelmapHouses';

declare global {
  interface Game_System {
    variableStorage: () => Map<string, any>;
    _variableStorage: Map<string, any>;
  }
}

export function initializeVariableStorage() {
  Game_System.prototype.variableStorage = function () {
    if (!this._variableStorage) {
      this._variableStorage = new Map<string, unknown>();
    }
    return this._variableStorage;
  };
  return new Map<string, unknown>();
}

const MAX_DIALOG_EXHAUSTION = 3;

PluginManager.registerCommand('pixelmapYarnSpinner', 'yarn', (args) => {
  return fetch(args['Yarn File Path']).then((response) => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status); // Rejects the promise
    }
    const prefix = args['Yarn File Path'].split('.')[0].replace('dialog/', '');
    const startAt = args['Start At'];
    void response.text().then((dialogue) => {
      yarnSpinnerProcesser(prefix, dialogue, startAt).catch((e) => {
        console.error(e);
      });
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
      break;
    default:
      break;
  }
}

async function commandHandler(cmdResult: YarnBound.CommandResult) {
  // This matcher splits by spaces, but ignores spaces within quotes
  const splitCmd = splitSpacesExcludeQuotes(cmdResult.command);

  const cmd = splitCmd[0];
  await getCommand(cmd, splitCmd.slice(1));

  //     break;
  //   case 'FadeToBlackAndBack':
  //     if (splitCmd.length == 2) {
  //       // @ts-ignore
  //       SceneManager._scene._active = false;
  //       $gameScreen.startFadeOut(30);
  //       await new Promise((r) => setTimeout(r, parseInt(splitCmd[1])));
  //       $gameScreen.startFadeIn(30);
  //       // @ts-ignore
  //       SceneManager._scene._active = true;
  //     } else {
  //       console.log('Invalid argument number passed into FadeToBlackAndBack!');
  //     }
  //     break;

  //     break;
  //   // case 'BuyHouse':
  //   //   if (splitCmd.length == 1) {
  //   //     buyHouse();
  //   //   } else {
  //   //     console.log('Invalid argument number passed into PlaySound!');
  //   //   }
  //   //   break;
  //   default:
  //     console.log('No support yet for command: ' + cmd);
  // }
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
