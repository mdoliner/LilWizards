/**
 * Created by Justin on 2016-02-24.
 */
'use strict';
import EventEmitter from 'event-emitter';
import Storage from '../utilities/local_storage';
const settings = Storage.get('settings') || {
  WinKills: 10,
  SEVolume: 1.0,
  BGMVolume: 0.6,
};

const changeable = ['WinKills', 'SEVolume', 'BGMVolume'];

export default EventEmitter({
  get(attr) {
    return settings[attr];
  },

  set(attr, val) {
    if (changeable.indexOf(attr) === -1) throw new Error('Setting doesn\'t exist: ' + attr);

    settings[attr] = val;
    setSettings();
    this.emit(attr, val);
  },
});

export function setSettings() {
  Storage.set('settings', settings);
}
