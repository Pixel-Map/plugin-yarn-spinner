import { invokeStardew, StardewCharacterData } from '../src/stardewMode';

test('hello', async () => {
  const characterData: StardewCharacterData = {
    name: 'Jay',
    occupation: 'Owner of a Turtle Farm',
    age: 24,
    gender: 'Male',
    speech_style: [
      'Calm but abrupt manner',
      'Very direct',
      'Occasionally makes funny random noises like "meeeeeeeee", "ooga booga", and "squee"',
    ],
    likes: ['Animals, especially Turtles', 'Growing plants of all types', 'Botany in general', 'Building things'],
    dislikes: ["People who don't like Turtles", 'Being rushed'],
  };
  const data = await invokeStardew(characterData);
  expect(data).toBe('hello');
});
