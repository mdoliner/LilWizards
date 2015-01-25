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
    events[level] = function (nlevel) {
      this.selectedLevel = LW.Levels[nlevel];
      this.runGame();
    }.args(level);
    commands.push(level);
  }

	var Level = LW.Menus.Level = new LW.MainMenu({
    title: "Level Select",
    commands: commands,
    events: events,
    parentMenu: LW.Menus.Character,
    runGame: function () {
      LW.GlobalSL.playSE('menu-select.ogg', 100)

      $('.main-menu').addClass("hidden");

      var bgm = document.getElementById("bgm");
      bgm.src = "audio/BGM/battle.mp3";
      bgm.volume = 0.2;
      var fgcanvas = document.getElementById("game-fg-canvas");
      var fgctx = fgcanvas.getContext('2d');
      var bgcanvas = document.getElementById("game-bg-canvas");
      var bgctx = bgcanvas.getContext('2d');
      var game = new LW.Game(this.selectedLevel);

      if (LW.Players.length === 1) {
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 0,
          spellList: ["Fireball", "Sword", "Wave"]
        }))
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 1,
          spellList: ["Fireball", "Sword", "Wave"]
        }))
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 2,
          spellList: ["Fireball", "Sword", "Wave"]
        }))
      }

      LW.Players.forEach(function (player) {
        game.wizards.push(player.makeWizard({
          game: game
        }))
      })
      var gameView = new LW.GameView(bgctx, fgctx, game);
      gameView.startGame();
      this.remove();
      bgm.play();
    }
  })

})();