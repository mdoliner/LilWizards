(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Particle = LW.Particle = function(options) {
    this.pos = new LW.Coord(options.pos);
    this.vel = new LW.Coord(options.vel);

    this.game = options.game;
    this.duration = options.duration;
    this.maxDuration = this.duration;
    this.radius = options.radius;
    this.drawType = options.drawType || 'square';
    this.radialSize = options.radialSize || 0.5;
    var colorArr;

    if (typeof options.color === 'string') {
      this.color = {};
      colorArr = colorMap[options.color];
      this.color.hue = colorArr[0];
      this.color.sat = colorArr[1];
      this.color.light = colorArr[2];
    } else {
      this.color = options.color;
    }

    this.color.alpha = this.color.alpha || 1.0;

    if (options.radialColor) {
      if (typeof options.radialColor === 'string') {
        this.radialColor = {};
        colorArr = colorMap[options.radialColor];
        this.radialColor.hue = colorArr[0];
        this.radialColor.sat = colorArr[1];
        this.radialColor.light = colorArr[2];
        this.radialColor.alpha = 1;
      } else {
        this.radialColor = options.radialColor;
      }
    } else {
      this.radialColor = {};
      for (var attr in this.color) {
        if (!this.color.hasOwnProperty(attr)) continue;
        this.radialColor[attr] = this.color[attr];
      }
    }

    this.tickEvent = options.tickEvent;
    options.intialize && options.initialize();
  };

  Particle.prototype.draw = function(ctx, camera) {
    ctx.beginPath();
    this.color.alpha = Math.min(1, this.duration * 2 / this.maxDuration);
    var newPos = camera.relativePos(this.pos);
    newPos.drawRound();
    var roundRadius = (this.radius * camera.size / 100 + 0.5) | 0;
    ctx.rect(
      newPos.x,
      newPos.y,
      roundRadius,
      roundRadius
    );
    this[this.drawType](ctx, roundRadius, newPos);
    ctx.fill();
  };

  Particle.prototype.square = function(ctx, radius, pos) {
    ctx.fillStyle = LW.parseColor(this.color);
  };

  Particle.prototype.radial = function(ctx, radius, pos) {
    var hR = (radius / 2) | 0;
    pos.plus(hR);
    var inRad = (hR * this.radialSize) | 0;
    var gradiant = ctx.createRadialGradient(pos.x, pos.y, hR, pos.x, pos.y, inRad);
    var outerColor = this.radialColor;
    outerColor.alpha = 0;
    gradiant.addColorStop(0, LW.parseColor(outerColor));
    gradiant.addColorStop(1, LW.parseColor(this.color));
    ctx.fillStyle = gradiant;
  };

  Particle.prototype.outerRadial = function(ctx, radius, pos) {
    var hR = (radius / 2) | 0;
    pos.plus(hR);
    var inRad = (hR * this.radialSize) | 0;
    var gradiant = ctx.createRadialGradient(pos.x, pos.y, hR, pos.x, pos.y, inRad);
    var innerColor = this.radialColor;
    innerColor.alpha = this.color.alpha;
    var oldAlpha = this.color.alpha;
    this.color.alpha = 0;
    gradiant.addColorStop(0, LW.parseColor(this.color));
    gradiant.addColorStop(1, LW.parseColor(innerColor));
    ctx.fillStyle = gradiant;
    this.color.alpha = oldAlpha;
  };

  Particle.prototype.move = function() {
    if (this.duration <= 0) {
      this.game.remove(this);
    }

    this.tickEvent && this.tickEvent();
    this.pos.plus(this.vel);
    this.duration -= 1;
  };

  var colorMap = {
    red: [0, 100, 50],
    green: [120, 100, 50],
    blue: [240, 100, 50],
    white: [0, 100, 100],
    black: [0, 100, 0],
    orange: [33, 100, 50],
    yellow: [60, 100, 50],
    purple: [280, 100, 50],
    grey: [0, 0, 50],
    lightgray: [0, 0, 75],
    lightblue: [240, 100, 75],
    lawngreen: [90, 100, 49],
    gold: [51, 100, 50],
    royalblue: [225, 73, 57],
    deepskyblue: [195, 100, 50],
    dodgerblue: [210, 100, 56],
    whitesmoke: [0, 0, 96],
    floralwhite: [40, 100, 97],
    crimson: [348, 83, 47],
    papayawhip: [37,16,100],
    orangered: [8,100,50],
  };

  LW.parseColor = function(color) {
    return 'hsla(' + color.hue + ',' + color.sat + '%,' + color.light + '%,' + color.alpha + ')';
  };

  var Library = LW.ParticleLibrary = function() {
    this.particles = new Array(Library.MAXPARTICLES);
    this.length = 0;
  };

  Library.MAXPARTICLES = 10000;

  Library.prototype.push = function(particle) {
    this.particles[this.length] = particle;
    this.length++;
  };

  Library.prototype.spliceOne = function(index) {
    if (!this.length) return;

    while (index < this.length) {
      this.particles[index] = this.particles[index + 1];
      index++;
    }

    this.length--;
  };

  Library.prototype.indexOf = function(particle) {
    for (var i = 0; i < this.length; i++) {
      if (this.particles[i] === particle) return i;
    }

    return -1;
  };

  Library.prototype.move = function() {
    for (var i = 0; i < this.length; i++) {
      this.particles[i].move();
    }
  };

  Library.prototype.draw = function(ctx, camera) {
    for (var i = 0; i < this.length; i++) {
      this.particles[i].draw(ctx, camera);
    }
  };

  LW.ParticleSplatter = function(amount, genFunc) {
    for (var i = 0; i < amount; i++) {
      var options = genFunc();
      options.game.particles.push(new LW.Particle(options));
    }
  };

})();
