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
    tooltip: "Choose a level to begin playing!",
    commands: commands,
    events: events,
    parentMenu: LW.Menus.Character,
    selector: '.main-menu-items',
    runGame: function () {
      LW.GlobalSL.playSE('menu-select.ogg', 100)

      $('.main-menu').addClass("hidden");

      LW.GlobalSL.playBGM("battle.mp3", 20);
      var fgcanvas = document.getElementById("game-fg-canvas");
      var fgctx = fgcanvas.getContext('2d');
      var bgcanvas = document.getElementById("game-bg-canvas");
      var bgctx = bgcanvas.getContext('2d');
      var game = new LW.Game(this.selectedLevel);

      if (LW.Players.length === 1) {
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 0,
          spellList: LW.Player.randomSpellList(),
          wizardGraphic: LW.Sprite.WIZARDS[LW.Players.length]
        }))
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 1,
          spellList: LW.Player.randomSpellList(),
          wizardGraphic: LW.Sprite.WIZARDS[LW.Players.length]
        }))
        LW.Players.push(new LW.Player({
          controllerType: "computer",
          controllerIndex: 2,
          spellList: LW.Player.randomSpellList(),
          wizardGraphic: LW.Sprite.WIZARDS[LW.Players.length]
        }))
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