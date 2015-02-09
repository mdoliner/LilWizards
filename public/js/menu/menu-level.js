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
      LW.runGame(LW.Levels[nlevel], nlevel, false);
			this.remove();
    }, level);
    commands.push(level);
  }

	var Level = LW.Menus.Level = new LW.MainMenu({
    title: "Level Select",
    tooltip: "Choose a level to begin playing!",
    commands: commands,
    events: events,
    parentMenu: LW.Menus.Character,
    selector: '.main-menu-items'
  })

})();
