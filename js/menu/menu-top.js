(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var TopMenu = LW.Menus.TopMenu = new LW.MainMenu({
    title: "Lil' Wizards",
    commands: ["local-game", "settings"],
    events: {
      "local-game": function () {
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