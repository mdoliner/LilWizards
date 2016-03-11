/**
 * Created by Justin on 2016-03-02.
 */
import topMenu from './top';
import settingsMenu from './settings';
import characterMenu from './character';
import playerCharacterMenu from './player_character';
import playerSlotMenu from './player_slots';
import playerSpellMenu from './player_spells';
import playerReadyMenu from './player_ready';

const layers = {
  top: topMenu,
  settings: settingsMenu,
  character: characterMenu,
  playerCharacter: playerCharacterMenu,
  playerSlots: playerSlotMenu,
  playerSpells: playerSpellMenu,
  playerReady: playerReadyMenu,
};

module.exports = layers;
