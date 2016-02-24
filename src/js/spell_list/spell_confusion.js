(function() {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var Confusion = LW.Spell.extend({
    img: require('graphics/spell_confusion.png'),
    dim: [10,10],
    duration: -1,
    sType: 'projectile',
    sId: 'confusions',
    imgSizeX: 25,
    imgSizeY: 25,
    imgBaseAngle: 180,
    tickEvent: function() {
      this.pos.plus(this.vel);
    },

    wizardColl: function(wizard) {
      if (wizard !== this.caster) {
        var confusion = new LW.Ailment({
          duration: 600,
          victim: wizard,
          initialize: function() {
            var newSpells = [];
            this.victimOldSpells = this.victim.spellList.slice(0);
            while (newSpells.length < 3) {
              var spell = LW.Wizard.TOTAL_SPELL_LIST[Math.floor(Math.random() * LW.Wizard.TOTAL_SPELL_LIST.length)];
              if (newSpells.indexOf(spell) === -1) {
                newSpells.push(spell);
              }
            }

            this.victim.spellList = newSpells;
          },

          tickEvent: function() {
            var particleRand = Math.random();
            if (particleRand > 0.5) {
              LW.ParticleSplatter(1, ConfusionSplatter.bind(this));
            }
          },

          removeEvent: function() {
            this.victim.spellList = this.victimOldSpells.slice(0);
          },
        });

        this.remove();
        wizard.addAilment(confusion);
        LW.ParticleSplatter(5, function() {
          var randVel = this.vel.dup().times(Math.random());
          randVel.plusAngleDeg(120 + Math.random() * 120);
          return {
            pos: wizard.pos,
            vel: randVel,
            game: this.game,
            duration: Math.floor(Math.random() * 20),
            radius: Math.random() * 2 + 2,
            color: 'lightgray',
          };
        }.bind(this));
        this.remove();
      }
    },
  });

  LW.SpellList.Confusion = function(spellIndex) {
    var spell = new Confusion({
      pos: this.pos,
      game: this.game,
      caster: this,
      vel: this.spellDirection().times(3.5),
    });
    this.game.spells.push(spell);
    this.globalCooldown = 30;
    this.cooldownList[spellIndex] = 210;
    return spell;
  };

  var ConfusionSplatter = function() {
    var randVel = new LW.Coord([0, -0.4]).times(Math.random());
    randVel.plusAngleDeg(Math.random() * 90 - 45);
    return {
      pos: this.victim.pos.dup().minus([Math.random() * 12 - 6, 19]),
      vel: randVel,
      game: this.victim.game,
      duration: Math.floor(Math.random() * 100 + 10),
      radius: Math.random() * 2 + 2,
      color: 'gold',
    };
  };

})();
