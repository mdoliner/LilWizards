(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var Settings = LW.Menus.Settings = new LW.MainMenu({
    commands: ["back"],
    events: {
      "back": function () {
        LW.GlobalSL.playSE('menu-select.ogg', 100)

        LW.Menus.TopMenu.swapTo({selector: '.main-menu-items'});
      }
    },
    parentMenu: LW.Menus.TopMenu
  })

})();