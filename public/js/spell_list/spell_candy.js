(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  LW.SpellList.EvilCandy = function (spellIndex) {
    var spell = new LW.Spell ({
      pos: this.pos,
      vel: [0,0],
      img: "graphics/spell_candy.png",
      imgSizeX: 10,
      imgSizeY: 10,
      dim: [18, 18],
      game: this.game,
      caster: this,
      sType: "static",
      sId: "candy",
      tickEvent: function () {
        if (this.mineBuffer === undefined) {
          this.mineBuffer = 120;
        }
        this.mineBuffer -= 1;
        if (this.mineBuffer <= 0) {
          this.sprite.baseAngle += 1;
        } else {
          this.sprite.sizeX += 0.25;
          this.sprite.sizeY += 0.25;
        }
      },
      wizardColl: function (wizard) {
        if (this.mineBuffer <= 0) {
          this.remove();
          wizard.kill(this.caster);
        }
      },
      solidColl: null,
      spellColl: function (spell) {
        if (spell.sId === "candy" || spell.sId === "forcePush" || spell.sId === "teleport") {return;}
        if (spell.sType !== "ray") {
          spell.remove();
        }
        this.remove();
      },
      removeEvent: function () {
        this.game.playSE('candy_explode.ogg');
        LW.ParticleSplatter(40, function () {
          var randVel = new LW.Coord([Math.random()*5,Math.random()*5]).plusAngleDeg(Math.random()*360);
          var color = ['orange', 'yellow', 'grey', 'black'][Math.floor(Math.random()*3 + 0.5)];
          return {
            pos: this.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random()*20+10),
            radius: Math.random()*5+1,
            color: color
          };
        }.bind(this))
      }

    });
    this.game.playSE('candy_make.ogg');
    this.game.spells.push(spell);
    this.globalCooldown = 0;
    this.cooldownList[spellIndex] = 45;
    return spell;
  }

})();
