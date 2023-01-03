# RPGMaker MZ Yarn Spinner Plugin

[Yarn Spinner](https://yarnspinner.dev/) is a fantastic tool designed to make writing game dialogue easier.
![banner](plugin-yarn-spinner.png)It was created by the makers of "Night in the Woods", and now you can finally use it within your [RPGMaker MZ](https://www.rpgmakerweb.com/products/rpg-maker-mz) games! 
Here are some of the features:

* 16+ Commands!
* 2+ Functions!
* Stardew Valley mode (See guide for more information)
* Sample Dialog!

## Commands
Commands allow Yarn Spinner to control parts of the game that you've built.

### Audio

| Name       | Signature                    | Documentation            |
| ---------- | ---------------------------- | ------------------------ |
| play_music | play_music music_name volume | Plays a music file       |
| play_sound | play_sound sound_name volume | Plays a sound file       |
| stop_music | stop_music duration          | Stops the playing music. |

### Camera

| Name         | Signature                                      | Documentation                                            |
| ------------ | ---------------------------------------------- | -------------------------------------------------------- |
| fade_in      | fade_in duration                               | Fade in the screen back to normal                        |
| fade_out     | fade_out duration red green blue grey alpha    | Fade out the screen (to black, or optionally to a color) |
| flash_screen | flash_screen duration red green blue intensity | Flash the screen (to white, or optionally to a color)    |

### Event

| Name       | Signature                                          | Documentation                                                                                                          |
| ---------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| hide_event | hide_event entity_name                             | Hides the entity with the given name.  If no entity provided, hides the calling entity                                 |
| move_event | move_event direction_name distance speed eventName | Move an event                                                                                                          |
| set_facing | set_facing direction event_name                    | Changes the direction the provided event name is facing.  If no event name is provided, defaults to the calling event. |
| show_event | show_event event_name opacity                      | Shows the event (if it's hidden).  If no event name provided, defaults to calling event.                               |

### Message

| Name           | Signature              | Documentation                                                                                                                         |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| set_background | set_background opacity | Sets the background of the message window; options are 0 (fully opaque), 1 (transparent), 2 (invisible background). The default is 0. |

### Player

| Name        | Signature                      | Documentation                                                                             |
| ----------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| add_gold    | add_gold amount                | Adds X amount of gold to the player                                                       |
| add_item    | add_item item_name quantity    | Adds an item with the provided name to the player's inventory, with an optional quantity. |
| remove_gold | remove_gold amount             | Remove X amount of gold to the player                                                     |
| remove_item | remove_item item_name quantity | Adds an item with the provided name to the player's inventory, with an optional quantity. |

### Script

| Name  | Signature     | Documentation                     |
| ----- | ------------- | --------------------------------- |
| wait  | wait duration | Waits for a given amount of time. |

## Functions
Functions are units of code that Yarn scripts can call to receive a value.

| Name         | Signature              | Documentation                                             |
| ------------ | ---------------------- | --------------------------------------------------------- |
| has_item     | has_item(itemName)     | Returns true if the player has the specified item.        |
| random_range | random_range(min, max) | Given a min and max, return a random number between them. |
