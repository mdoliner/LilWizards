(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var TopMenu = LW.Menus.TopMenu = new LW.MainMenu({
    title: "Lil' Wizards",
    commands: ["local-game", "character-select", "settings"],
    events: {
      "local-game": function () {
        LW.GlobalSL.playSE('menu-select.ogg', 100)

        $('.main-menu').addClass("hidden");

        var bgm = document.getElementById("bgm");
        bgm.src = "audio/BGM/battle.mp3";
        bgm.volume = 0.2;
        var sound_library = new LW.SoundLibrary();
        var fgcanvas = document.getElementById("game-fg-canvas");
        var fgctx = fgcanvas.getContext('2d');
        var bgcanvas = document.getElementById("game-bg-canvas");
        var bgctx = bgcanvas.getContext('2d');
        var gameView = new LW.GameView(bgctx, fgctx);
        gameView.game.audio = sound_library;
        gameView.startGame();
        this.remove();
        // bgm.play();
      },
      "character-select": function () {
        LW.GlobalSL.playSE('menu-select.ogg', 100)
        LW.Menus.Character.swapTo({selector: '.main-menu-items'});
      },
      "settings": function () {
      	LW.GlobalSL.playSE('menu-select.ogg', 100)
      	LW.Menus.Settings.swapTo({selector: '.main-menu-items'});
      }
    }
  })

})();