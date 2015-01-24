(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var CategoryView = function (player, $parentEl) {
  	var $parentEl = $parentEl || $("<li class='menu-quad'>");
  	return {
  		player: player,
  		commands: ["ninja", "brawler", "dry-gone", "ready-up"],
  		$parentEl: $parentEl,
  		events: {
  			"ninja": function () {
  				this.remove();
  				new LW.QuadView(SpellsView(player, this.$parentEl, [
  					"Sword",
  					"FanOfKnives",
  					"Teleport",
  					"ToxicDarts"
  				]));
  			},
  			"brawler": function () {
  				this.remove();
  				new LW.QuadView(SpellsView(player, this.$parentEl, [
  					"Crash",
  					"Updraft",
  					"Wave",
  					"WreckingBall"
  				]));
  			},
  			"dry-gone": function () {
  				this.remove();
  				new LW.QuadView(SpellsView(player, this.$parentEl, [
  					"Fireball",
  					"RayCannon",
  					"ForcePush",
  					"Candy"
  				]));
  			},
  			"ready-up": function () {
  				if (this.player.spellList.indexOf(null) !== -1) {
  					LW.GlobalSL.playSE('fail.ogg', 100)
  					return;
  				}
  				this.remove();
  				this.player.menuReady = true;
  				new LW.QuadView(ReadyUpView(this.player, this.$parentEl));
  				var numOfPlayersReady = 0;
  				for (var i = LW.Players.length - 1; i >= 0; i--) {
  					if (LW.Players[i].menuReady) {
  						numOfPlayersReady++;
  					}
  				};
  				if (numOfPlayersReady === LW.Players.length) {
  					////// FUCK YAEH
  				}
  			}
  		}
  	};
  };

  var SpellsView = function (player, $parentEl, spells) {
  	var events = {};
  	spells.forEach(function (spell) {
  		events[spell] = function (spellIndex) {
  			if (spellIndex >= 0) {
  				var newSpell = LW.SpellList[spell];
  				var oldIndex;
  				if ((oldIndex = player.spellList.indexOf(newSpell)) !== -1) {
  					player.spellList[oldIndex] = null;
  				}
  				player.spellList[spellIndex] = LW.SpellList[spell];
  			}
  			this.remove();
  			new LW.QuadView(CategoryView(player, $parentEl));
  		};
  	});
  	return {
  		player: player,
  		commands: spells,
  		$parentEl: $parentEl,
  		events: events
  	};
  };

  var ReadyUpView = function (player, $parentEl) {
  	return {
  		player: player,
  		commands: ["de-ready"],
  		$parentEl: $parentEl,
  		events: {
  			"de-ready": function () {
  				this.player.menuReady = false;
  				this.remove();
  				new LW.QuadView(CategoryView(this.player, this.$parentEl));
  			}
  		}
  	};
  };

	var Character = LW.Menus.Character = new LW.MainMenu({
		title: "Character Select",
    commands: [],
    events: {},
    quadViews: [],
    executeCommand: function (player) {
    	if (LW.Players.length >= 4) {return;}
    	var quad = new LW.QuadView(CategoryView(player));
    	LW.Players.push(player);
    	$('.main-menu-quads').append(quad.$parentEl);
    	this.quadViews.push(quad);
    },
    parentMenu: LW.Menus.TopMenu
  });

})();