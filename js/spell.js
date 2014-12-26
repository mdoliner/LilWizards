(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Spell = LW.Spell = function (options) {
    defaults = {
      tickEvent: function () {},
      collEvent: function () {},
      removeEvent: function () {},
      duration: -1
    }
    for (var attrname in options) { defaults[attrname] = options[attrname]; }

    this.pos = new LW.Coord(defaults.pos);
    this.vel = new LW.Coord(defaults.vel);
    this.img = new Image();
    this.img.src = defaults.img;
    this.collBox = new CollBox(this.pos, defaults.dim)
    this.tickEvent = defaults.tickEvent;
    this.collEvent = defaults.collEvent;
    this.removeEvent = defaults.removeEvent;
    this.duration = defaults.duration;
    this.game = defaults.game;
  };

  Spell.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.pos.x-this.img.width/2, this.pos.y-this.img.height/2);
  };

  Spell.prototype.move = function () {
    this.tickEvent();
    this.pos.plus(this.vel);
    this.duration -= 1;
    if (this.duration === 0) {
      this.remove();
    }
  };

  Spell.prototype.remove = function () {
    this.removeEvent();
    this.game.remove(this);
  };

})();
