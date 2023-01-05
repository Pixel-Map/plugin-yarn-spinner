// @ts-ignore
import YarnBound from 'yarn-bound';
import { getCommand } from './commands';
import { functions } from './functions';
import { addFormattedGameMessage } from './processor/addFormattedGameMessage';
import { splitSpacesExcludeQuotes } from './split-spaces-exclude-quotes';
import { YarnNodeType } from './types';

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

PluginManager.registerCommand('pixelmapYarnSpinner', 'yarn', invokeYarn);

function invokeYarn(this: any, args: any) {
  const callingEventId: number = this._eventId as number;
  return fetch(args['Yarn File Path']).then((response) => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status); // Rejects the promise
    }
    const prefix = args['Yarn File Path'].split('.')[0].replace('dialog/', '');
    const startAt = args['Start At'];
    void response.text().then((dialogue) => {
      yarnSpinnerProcesser(prefix, dialogue, startAt, callingEventId).catch((e) => {
        console.error(e);
      });
    });
  });
}


export async function yarnSpinnerProcesser(prefix: string, dialogue: string, startAt: string, callingEventId: number) {
  const variableStorage = new VariableStorage(prefix);

  // Stardew Mode is heavily opinionated, and based on https://stardewvalleywiki.com/Modding:Dialogue
  if (startAt == 'StardewMode') {
    startAt = getStardewModeNode(variableStorage, dialogue);
  }

  const runner = new YarnBound({
    dialogue,
    startAt: startAt,
    functions: functions,
    variableStorage: variableStorage,
  });

  await processYarnDialog(runner, callingEventId);
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

async function processYarnDialog(runner: YarnBound, callingEventId: number) {
  const currentResult = runner.currentResult;
  switch (currentResult.constructor) {
    case YarnBound.TextResult:
      await addFormattedGameMessage(currentResult);
      if (!currentResult.isDialogueEnd) {
        if (currentResult.text.trim().length > 0) {
          // console.log("Noodles")
          // $gameMessage.newPage();
        }
        runner.advance();
        await processYarnDialog(runner, callingEventId);
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
        await processYarnDialog(runner, callingEventId);
      });
      break;
    case YarnBound.CommandResult:
      await commandHandler(currentResult, callingEventId);
      if (!currentResult.isDialogueEnd) {
        runner.advance();
        await processYarnDialog(runner, callingEventId);
      }
      break;
    default:
      break;
  }
}

async function commandHandler(cmdResult: YarnBound.CommandResult, callingEventId: number) {
  // This matcher splits by spaces, but ignores spaces within quotes
  const splitCmd = splitSpacesExcludeQuotes(cmdResult.command);
  const cmd = splitCmd[0];
  await getCommand(cmd, splitCmd.slice(1), callingEventId);
}

const storage = new Map<string, unknown>();
class VariableStorage {
  storage: Map<string, unknown>;
  prefix: string;

  constructor(prefix: string) {
    // this.storage = MMO_Core_Player.mmoVariableStorage as Map<string, unknown>;
    this.storage = storage;
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
    return this.storage.get(retrievalKey) ?? 'unknown';
  }

  set(key: string, value: any) {
    const retrievalKey = key.startsWith('global_') ? key : this.prefix + '_' + key;
    this.storage.set(retrievalKey, value);
  }
}

function getDynamicValue(variableName: string): any {
  console.log(variableName);
  return true;
}

