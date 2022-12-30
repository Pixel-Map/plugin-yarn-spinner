/**
 * Adds X amount of gold to the player
 * @param amount - The amount of gold to add
 */
export function add_gold(_callingEventId: number, amount: number) {
  $gameParty.gainGold(amount);
}
