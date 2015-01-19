(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var SoundLibrary = LW.SoundLibrary = function () {
    this.audioTags = []
    this.$audio = $('div.audio-tags')
    for (var i = SoundLibrary.MAXTAGS - 1; i >= 0; i--) {
      var $newTag = $('<audio>');
      this.$audio.append($newTag);
      this.audioTags.push($newTag);
    };
    this.currentIndex = 0;
  };

  SoundLibrary.prototype.playSE = function (src, volume) {
    var $audio = this.audioTags[this.currentIndex]
    $audio.attr('src',"audio/SE/"+src);
    $audio.attr('volume', volume)
    $audio[0].play();
    this.currentIndex = (this.currentIndex + 1) % this.audioTags.length
  }

  SoundLibrary.MAXTAGS = 40;

  LW.GlobalSL = new SoundLibrary();

})();
