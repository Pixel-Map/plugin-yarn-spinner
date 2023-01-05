/**
 * Updates the character's face image within gameMessage if available.
 * @param currentResult
 */
export function updateCharacterPortrait(currentResult: any) {
  const character = currentResult.markup.find((markup: { name: string }) => {
    return markup.name === 'character';
  });
  if (character) {
    $gameMessage.setFaceImage(character.properties.name, 0);
  }
}
