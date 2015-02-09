(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

  LW.Settings = {
    WinKills: 10,
    SEVolume: 1.0,
    BGMVolume: 0.6
  };

  var WinKillsSelection = [1, 5, 10, 20, 40, 100];
  var VolumeSelection = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

	var Settings = LW.Menus.Settings = new LW.MainMenu({
    title: "Settings",
    tooltip: "Hey look! Settings!",
    commands: ["kill-count", "effect-vol", "music-vol", "Back"],
    events: {
      "kill-count": function () {
        LW.GlobalSL.playSE('menu-select.ogg', 100)
        var index = WinKillsSelection.indexOf(LW.Settings.WinKills);
        LW.Settings.WinKills = WinKillsSelection[(index + 1) % WinKillsSelection.length];

        $(this.selector).empty();
        this.addItems(0);
      },
      "effect-vol": function () {
        var index = VolumeSelection.indexOf(LW.Settings.SEVolume);
        LW.Settings.SEVolume = VolumeSelection[(index + 1) % VolumeSelection.length];

        LW.GlobalSL.playSE('menu-select.ogg', 100)

        $(this.selector).empty();
        this.addItems(1);
      },
      "music-vol": function () {
        LW.GlobalSL.playSE('menu-select.ogg', 100)
        var index = VolumeSelection.indexOf(LW.Settings.BGMVolume);
        LW.Settings.BGMVolume = VolumeSelection[(index + 1) % VolumeSelection.length];
        LW.GlobalSL.adjustBGMVolume();

        $(this.selector).empty();
        this.addItems(2);
      },
      "Back": function () {
        LW.GlobalSL.playSE('menu-cancel.ogg', 100)

        LW.Menus.TopMenu.swapTo();
      }
    },
    commandTooltips: {
      "kill-count": function () {
        return "Current Kill Count to Win: " + LW.Settings.WinKills;
      },
      "effect-vol": function () {
        return "Current Sound Effect Volume Level: " + LW.Settings.SEVolume * 100 + "%";
      },
      "music-vol": function () {
        return "Current Music Volume Level: " + LW.Settings.BGMVolume * 100 + "%";
      }
    },
    selector: '.main-menu-items',
    parentMenu: LW.Menus.TopMenu
  })

})();