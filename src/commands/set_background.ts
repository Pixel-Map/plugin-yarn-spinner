/**
 * Sets the background of the message window; options are 0 (fully opaque), 1 (transparent), 2 (invisible background). The default is 0.
 * @param opacity - The opacity of the background, 0, 1, or 2.
 */
export function set_background(_callingEventId: number, opacity: number = 0) {
  if (opacity < 0 || opacity > 2) {
    throw new Error('Invalid opacity level, must be between 0 and two');
  }

  $gameMessage.setBackground(opacity);
}
