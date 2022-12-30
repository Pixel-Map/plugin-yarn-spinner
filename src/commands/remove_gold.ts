export function remove_gold(_callingEventId: number, amount: number) {
  $gameParty.loseGold(amount);
}
