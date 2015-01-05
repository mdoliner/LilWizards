(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Particle = LW.Particle = function (options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);

    this.game = options.game;
    this.duration = options.duration;
    this.maxDuration = this.duration;
    this.radius = options.radius;
    this.color = options.color;
    this.tickEvent = options.tickEvent;
  };

  Particle.prototype.draw = function (ctx, camera) {
    ctx.beginPath();
    ctx.globalAlpha = Math.min(1,this.duration*2/this.maxDuration);
    var newPos = camera.relativePos(this.pos);
    newPos.drawRound();
    var roundRadius = (this.radius * camera.size / 100 + 0.5) | 0;
    ctx.rect(
      newPos.x, 
      newPos.y, 
      roundRadius, 
      roundRadius
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  Particle.prototype.move = function () {
    if (this.duration <= 0) {
      this.game.remove(this);
    }
    if (this.tickEvent) {
      this.tickEvent();
    }
    this.pos.plus(this.vel);
    this.duration -= 1;
  };

  LW.ParticleSplatter = function (amount, genFunc) {
    for (var i = 0; i < amount; i++) {
      var options = genFunc();
      options.game.particles.push(new LW.Particle(options));
    }
  }

})();
