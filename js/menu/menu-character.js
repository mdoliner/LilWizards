(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}
	if (window.LW.Menus === undefined) {
		window.LW.Menus = {};
	}

	var Character = LW.Menus.Character = new LW.MainMenu({
		title: "Character Select",
    commands: [],
    events: {},
    quadViews: [],
    executeCommand: function (player) {
    	if (LW.Players.length >= 4) {return;}
    	var quad = new LW.QuadView({
    		player: player,
    		commands: [],
    		events: {}
    	});
    	LW.Players.push(player);
    	$('.main-menu-quads').append(quad.$el);
    	this.quadViews.push(quad);
    },
    parentMenu: LW.Menus.TopMenu
  })

})();