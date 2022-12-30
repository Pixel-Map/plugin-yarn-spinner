export function removeGold(_callingEventId: number, amount: number) {
  $gameParty.loseGold(amount);
}
