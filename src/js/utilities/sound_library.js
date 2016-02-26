/**
 * Sound Library
 * Plays sounds. Its true!
 */
'use strict';
import Settings from '../settings/settings';
import $ from 'jquery';

const ALL_SOUNDS = window.ALL_SOUNDS = {};
const _ = require('lodash');
function requireAllSounds(r) {
  r.keys().forEach((k) => {
    const ref = _.last(k.split('/'));
    ALL_SOUNDS[ref] = r(k);
  });
}

requireAllSounds(require.context('../../audio', true, /\.(mp3|ogg)$/));

function SoundLibrary() {
  this.audioTags = [];
  this.bgmVol = Settings.BGMVolume;

  this.currentIndex = 0;
  this.getEls();
}

SoundLibrary.prototype.getEls = function () {
  this.$audio = $('div.audio-tags');
  this.$bgm = $('#bgm');

  if (this.generatedTags && this.$audio[0]) return;

  this.generatedTags = true;
  for (var i = SoundLibrary.MAXTAGS - 1; i >= 0; i--) {
    var $newTag = $('<audio>');
    this.$audio.append($newTag);
    this.audioTags.push($newTag);
  }
};

SoundLibrary.prototype.playSE = function (src, volume) {
  if (volume > 1) {
    volume /= 100;
  }

  volume *= Settings.SEVolume;
  var $audio = this.audioTags[this.currentIndex];
  var audio = $audio[0];
  audio.src = ALL_SOUNDS[src];
  audio.volume = volume;
  audio.play();
  this.currentIndex = (this.currentIndex + 1) % this.audioTags.length;
};

SoundLibrary.prototype.playBGM = function (src, volume) {
  volume = volume || 70;
  volume *= this.bgmVol;
  volume /= 100;
  this.$bgm.attr('src', ALL_SOUNDS[src]);
  this.$bgm[0].volume = volume;
  this.$bgm[0].play();
};

SoundLibrary.prototype.adjustBGMVolume = function () {
  var vol = this.$bgm[0].volume;
  vol /= this.bgmVol;
  this.bgmVol = Settings.BGMVolume;
  if (this.bgmVol === 0) {
    this.bgmVol += 0.000001;
  }

  vol *= this.bgmVol;
  this.$bgm[0].volume = vol;
};

SoundLibrary.MAXTAGS = 40;

export default SoundLibrary;

export const GlobalSL = new SoundLibrary();
