(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

  var events = {};
  var commands = [];
  for (var level in LW.Levels) {
    events[level] = Util.args(function (nlevel) {
      this.nlevel = nlevel
      this.selectedLevel = LW.Levels[nlevel];
      this.runGame();
    }, level);
    commands.push(level);
  }

  var songs = [
    "Castlemania.mp3",
    "Full-Circle.mp3",
    "battle.mp3"
  ]

  var backgrounds = {
    Library: "bg_bookcase.jpg",
    Cemetery: "bg-cemetery.png"
  }

	var Level = LW.Menus.Level = new LW.MainMenu({
    title: "Level Select",
    tooltip: "Choose a level to begin playing!",
    commands: commands,
    events: events,
    parentMenu: LW.Menus.Character,
    selector: '.main-menu-items',
    runGame: function () {
      LW.GlobalSL.playSE('menu-select.ogg', 100)

      $('.main-menu').addClass("hidden");

      var song = songs[Math.floor(songs.length * Math.random())]
      LW.GlobalSL.playBGM(song);
      var fgcanvas = document.getElementById("game-fg-canvas");
      var fgctx = fgcanvas.getContext('2d');
      var bgcanvas = document.getElementById("game-bg-canvas");
      var bgctx = bgcanvas.getContext('2d');
      var game = new LW.Game({
        level: this.selectedLevel,
        background: backgrounds[this.nlevel]
      });

      if (LW.Players.length === 1) {
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 0,
          spellList: LW.Player.randomSpellList(),
          wizardGraphic: LW.Sprite.WIZARDS[0]
        }))
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 1,
          spellList: LW.Player.randomSpellList(),
          wizardGraphic: LW.Sprite.WIZARDS[0]
        }))
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 2,
          spellList: LW.Player.randomSpellList(),
          wizardGraphic: LW.Sprite.WIZARDS[0]
        }))
        LW.Players.slice(1).forEach(function (player) {
          player.nextSprite(1);
        })
      }
      for (var i = 0; i < LW.Players.length; i++) {        
        game.wizards.push(LW.Players[i].makeWizard({
          game: game
        }));
      }
      var gameView = new LW.GameView(bgctx, fgctx, game);
      gameView.startGame();
      this.remove();
      bgm.play();
    }
  })

})();