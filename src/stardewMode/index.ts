// import { yarnSpinnerProcesser } from '../index';
import YAML from 'yaml';
import { capitalizeFirstLetter } from '../docUtils/capitalizeFirstLetter';

export interface StardewCharacterData {
  name: string;
  occupation: string;
  age: number;
  gender: string;
  speech_style: Array<string>;
  likes: Array<string>;
  dislikes: Array<string>;
}

export async function getCharacterData(characterName: string) {
  const charDataRaw = await fetch(`dialog/${characterName}/character.yaml`).then((response) => {
    if (!response.ok) {
      console.error('Could not load character data for ' + characterName);
      throw new Error('HTTP error ' + response.status); // Rejects the promise
    }
    return response.text();
  });
  return YAML.parse(charDataRaw) as StardewCharacterData;
}

export function invokeStardew(characterData: StardewCharacterData) {
  const [pronoun, _obj, _poss] = getPronouns(characterData.gender.toLowerCase() as 'male' | 'female' | 'other');
  return `${characterData.name} is a ${characterData.gender.toLowerCase()} ${
    characterData.age
  } year old ${characterData.occupation.toLowerCase()}.  ${capitalizeFirstLetter(pronoun)} talks in a ${joinWithAnd(
    characterData.speech_style,
  ).toLowerCase()}.  ${capitalizeFirstLetter(pronoun)} likes ${joinWithAnd(
    characterData.likes,
  ).toLowerCase()}.  ${capitalizeFirstLetter(pronoun)} dislikes ${joinWithAnd(characterData.dislikes).toLowerCase()}.`;
  // const callingEventId: number = this._eventId as number;
}

function joinWithAnd(arr: Array<string>) {
  if (arr.length === 1) return arr[0];
  const firsts = arr.slice(0, arr.length - 1);
  const last = arr[arr.length - 1];
  return firsts.join(', ') + ' and ' + last;
}

function getPronouns(gender: 'male' | 'female' | 'other') {
  if (gender == 'male') {
    return ['he', 'him', 'his'];
  }
  if (gender == 'female') {
    return ['she', 'her', 'hers'];
  }
  return ['they', 'them', 'theirs'];
}
