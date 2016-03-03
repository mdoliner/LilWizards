/**
 * Created by Justin on 2016-03-02.
 */
import topMenu from './top';
import settingsMenu from './settings';
import characterMenu from './character';
import playerCharacterMenu from './player_character';

const layers = {
  top: topMenu,
  settings: settingsMenu,
  character: characterMenu,
  playerCharacter: playerCharacterMenu,
};

module.exports = layers;
