/**
 * addGold
 * description: Adds gold to the player
 * @param amount - The amount of gold to add
 */
export function addGold(_callingEventId: number, amount: number) {
  $gameParty.gainGold(amount);
}
