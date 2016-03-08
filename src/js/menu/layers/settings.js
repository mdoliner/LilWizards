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
    { name: 'Music Volume', type: 'action', effect: 'sound' },
    { name: 'Sound Volume', type: 'action', effect: 'music' },
    { name: 'Back', type: 'back' },
  ],

  action({ command }) {
    return () => {
      switch (command.effect) {
        case 'kills': {
          break;
        }

        case 'sound': {
          break;
        }

        case 'music': {
          break;
        }
      }
    };
  },
};

export default settingsMenu;
