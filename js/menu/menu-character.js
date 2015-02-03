(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var CategoryView = function (player, $parentEl) {
  	var $parentEl = $parentEl || $("<li class='menu-quad group'>");
  	return {
  		player: player,
  		commands: ["ninja-spells", "brawler-spells", "elemental-spells", "eldritch-spells", "ready-up"],
  		$parentEl: $parentEl,
      quadTitle: "",
  		events: {
  			"ninja-spells": function () {
  				this.remove();
  				this.childQuad = new LW.QuadView(SpellsView(player, this.$parentEl, "Ninja", [
  					"Sword",
  					"FanOfKnives",
  					"Teleport",
  					"ToxicDarts"
  				]));
  			},
  			"brawler-spells": function () {
  				this.remove();
  				this.childQuad = new LW.QuadView(SpellsView(player, this.$parentEl, "Brawler", [
  					"Crash",
  					"Updraft",
  					"Wave",
  					"WreckingBall",
            "MeteorShell"
  				]));
  			},
  			"elemental-spells": function () {
  				this.remove();
  				this.childQuad = new LW.QuadView(SpellsView(player, this.$parentEl, "Elemental", [
  					"Fireball",
  					"RayCannon",
  					"ForcePush"
  					
  				]));
  			},
        "eldritch-spells": function () {
          this.remove();
          this.childQuad = new LW.QuadView(SpellsView(player, this.$parentEl, "Eldritch", [
            "Vomit",
            "EvilCandy",
            "Berserk",
            "DarkRift"
          ]));
        },
  			"ready-up": function () {
  				if (this.player.spellList.indexOf(null) !== -1) {
  					LW.GlobalSL.playSE('fail.ogg', 100)
  					return;
  				}
  				this.remove();
  				this.player.menuReady = true;
  				this.childQuad = new LW.QuadView(ReadyUpView(this.player, this.$parentEl));
  				var numOfPlayersReady = 0;
  				for (var i = LW.Players.length - 1; i >= 0; i--) {
  					if (LW.Players[i].menuReady) {
  						numOfPlayersReady++;
  					}
  				};
  				if (numOfPlayersReady === LW.Players.length) {
  					LW.Menus.Level.swapTo();
  				}
  			}
  		}
  	};
  };

  var SpellsView = function (player, $parentEl, title, spells) {
  	var events = {};
  	spells.forEach(function (spell) {
  		events[spell] = function (spellIndex) {
  			if (spellIndex >= 0) {
  				var newSpell = spell;
  				var oldIndex;
  				if ((oldIndex = player.spellList.indexOf(newSpell)) !== -1) {
  					player.spellList[oldIndex] = null;
  				}
  				player.spellList[spellIndex] = spell;
  			}
  			this.remove();
  			this.childQuad = new LW.QuadView(CategoryView(player, $parentEl));
  		};
  	});
  	return {
  		player: player,
  		commands: spells,
  		$parentEl: $parentEl,
      quadTitle: title + " Spells",
      isSpellMenu: true,
  		events: events
  	};
  };

  var ReadyUpView = function (player, $parentEl) {
  	return {
  		player: player,
  		commands: ["de-ready"],
  		$parentEl: $parentEl,
      quadTitle: "Ready!",
      SE: "equip.ogg",
  		events: {
  			"de-ready": function () {
  				this.player.menuReady = false;
  				this.remove();
  				this.childQuad = new LW.QuadView(CategoryView(this.player, this.$parentEl));
  			}
  		}
  	};
  };

	var Character = LW.Menus.Character = new LW.MainMenu({
		title: "Character Select",
    tooltip: "Press jump to join. <br> Use spell keys to select spells. <br> Ready up when you have 3 spells.",
    commands: ["back"],
    events: {
    	"back": function () {
    		LW.GlobalSL.playSE('menu-cancel.ogg', 100)
      	LW.Menus.TopMenu.swapTo();
    	}
    },
    quadViews: [],
    executeCommand: function (player) {
    	if (LW.Players.length >= 4) {return;}
      if (LW.Players.length > 1) {
        $('.menu-tooltip').addClass('hidden')
      }
      LW.GlobalSL.playSE('menu-select.ogg', 100)
      player.nextSprite(1);
    	var quad = new LW.QuadView(CategoryView(player));
    	LW.Players.push(player);
    	$('.main-menu-quads').append(quad.$parentEl);
    	this.quadViews.push(quad);
    },
    parentMenu: LW.Menus.TopMenu,
    swapToEvent: function () {
      if (LW.Players.length > 2) {
        $('.menu-tooltip').addClass('hidden')
      }
    	LW.Players.forEach(function (player) {
    		var quad = new LW.QuadView(CategoryView(player));
	    	$('.main-menu-quads').append(quad.$parentEl);
	    	this.quadViews.push(quad);
    	}.bind(this))
    },
    removeEvent: function () {
      LW.Players.forEach(function (player) {
        player.menuReady = false;
      });
    },
    selector: '.main-menu-items'
  });

})();