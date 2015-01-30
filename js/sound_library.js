(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SoundLibrary = LW.SoundLibrary = function () {
    this.audioTags = [];
    this.$audio = $('div.audio-tags');
    this.$bgm = $('#bgm');
    this.bgmVol = LW.Settings.BGMVolume;
    for (var i = SoundLibrary.MAXTAGS - 1; i >= 0; i--) {
      var $newTag = $('<audio>');
      this.$audio.append($newTag);
      this.audioTags.push($newTag);
    };
    this.currentIndex = 0;
  };

  SoundLibrary.prototype.playSE = function (src, volume) {
    if (volume > 1) {
      volume /= 100;
    }
    volume *= LW.Settings.SEVolume;
    var $audio = this.audioTags[this.currentIndex]
    var audio = $audio[0];
    audio.src = "audio/SE/"+src;
    audio.volume = volume
    audio.play();
    this.currentIndex = (this.currentIndex + 1) % this.audioTags.length
  };

  SoundLibrary.prototype.playBGM = function (src, volume) {
    volume = volume || 70;
    volume *= this.bgmVol;
    volume /= 100;
    this.$bgm.attr('src',"audio/BGM/" + src);
    this.$bgm[0].volume = volume;
    this.$bgm[0].play();
  }

  SoundLibrary.prototype.adjustBGMVolume = function () {
    var vol = this.$bgm[0].volume
    vol /= this.bgmVol;
    this.bgmVol = LW.Settings.BGMVolume;
    if (this.bgmVol === 0) {
      this.bgmVol += 0.000001
    } 
    vol *= this.bgmVol
    this.$bgm[0].volume = vol;
  };

  SoundLibrary.MAXTAGS = 40;

})();
