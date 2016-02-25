/**
 * Created by Justin on 2016-02-24.
 */
'use strict';
import Storage from '../utilities/local_storage';
export default Storage.get('settings') || {
  WinKills: 10,
  SEVolume: 1.0,
  BGMVolume: 0.6,
};

export function setSettings() {
  Storage.set('settings', LW.Settings);
}
  