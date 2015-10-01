(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Ailment = LW.Ailment = function(attr) {
    Util.extend(this, attr);
    this.initialize && this.initialize();
    this.time = this.duration || 120;
    this.victim = attr.victim;
  };

  Ailment.prototype.tickEvent = function() {};

  Ailment.prototype.removeEvent = function() {};

  Ailment.prototype.step = function() {
    this.tickEvent && this.tickEvent();
    this.time -= 1;
    if (this.time === 0) {
      this.remove();
    }
  };

  Ailment.prototype.remove = function() {
    this.victim.remove(this);
    this.removeEvent && this.removeEvent();
  };

})();
