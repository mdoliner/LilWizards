(function () {
	if (window.LW === undefined) {
		window.LW = {};
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var TopMenu = LW.Menus.TopMenu = new LW.MainMenu({
    title: "Lil' Wizards",
    tooltip: "Welcome to Lil' Wizards! <br> The controls are at the bottom.",
    commands: ["demo-mode", "local-game", "settings"],
    events: {
			"demo-mode": function () {
				var player = LW.AllPlayers[0];
				player.spellList = LW.Player.randomSpellList();
				player.wizardGraphic = LW.Sprite.WIZARDS[0];
				LW.Players = [player];
				LW.runGame(LW.Levels["Library"], "Library", true);
				this.remove();
			},
      "local-game": function () {
        LW.GlobalSL.playSE('menu-select.ogg', 100)
        LW.Menus.Character.swapTo({selector: '.main-menu-items'});
      },
      "settings": function () {
      	LW.GlobalSL.playSE('menu-select.ogg', 100)
      	LW.Menus.Settings.swapTo({selector: '.main-menu-items'});
      }
    },
    commandTooltips: {
    },
    selector: '.main-menu-items'
  })

})();
