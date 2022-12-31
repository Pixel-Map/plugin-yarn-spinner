/**
 * Remove X amount of gold to the player
 * @param amount - The amount of gold to remove
 * @remarks Player
 */
export function remove_gold(_callingEventId: number, amount: number) {
  $gameParty.loseGold(amount);
}
