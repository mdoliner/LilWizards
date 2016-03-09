/**
 * Created by Justin on 2016-03-02.
 */
import Settings from '../../settings/settings';
const KILLS_SELECTION = [1, 5, 10, 20, 40, 100];
const VOL_SELECTION = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

const settingsMenu = {
  type: 'basic',
  commands: [
    { name: 'Kills', type: 'action', effect: 'kills' },
    { name: 'Sound Volume', type: 'action', effect: 'sound' },
    { name: 'Music Volume', type: 'action', effect: 'music' },
    { name: 'Back', type: 'back' },
  ],

  action({ command }) {
    return () => {
      switch (command.effect) {
        case 'kills': {
          Settings.set('WinKills', getNextValue(KILLS_SELECTION, Settings.get('WinKills')));
          break;
        }

        case 'sound': {
          Settings.set('SEVolume', getNextValue(VOL_SELECTION, Settings.get('SEVolume')));
          break;
        }

        case 'music': {
          Settings.set('BGMVolume', getNextValue(VOL_SELECTION, Settings.get('BGMVolume')));
          break;
        }
      }
    };
  },
};

export default settingsMenu;

function getNextValue(array, val) {
  const idx = array.indexOf(val);
  const next = (idx + 1) % array.length;
  return array[next];
}
