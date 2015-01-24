(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}

	var QuadView = LW.QuadView = function (options) {
		LW.MainMenu.call(this, options);
		this.$el = $("<li class='menu-quad'>");
		this.$menuItems = $("<ul class='menu-quad-items'>");
		this.$el.append(this.$menuItems);
		this.checkingInputs = setInterval(this.checkInput.bind(this), 1000/60);
		this.addItems();
	};

	QuadView.inherits(LW.MainMenu);

	QuadView.prototype.addItems = function () {
		for (var i = 0; this.commands.length > i; i++) {
			command = this.commands[i];
			var $li = $('<li>');
			$li.addClass('menu-item')
			$li.addClass(command);
			if (i === 0) {
				$li.addClass('selected');
			}
			$li.html(command);
			$li.data('command', command);
			this.$menuItems.append($li);
			$("."+command).on("click", this.events[command].bind(this));
		};
	};

	QuadView.prototype.checkInput = function () {
		this.player.checkControllerActions();
		var wizard = this.player.wizard;
		if (wizard.actions["jump"] === "tap") {
			this.executeCommand(this.player);
		}
		if (wizard.actions["up"] === "tap") {
			this.selectCommand(-1);
		}
		if (wizard.actions["down"] === "tap") {
			this.selectCommand(1);
		}
		if (wizard.actions["spells"][2] === "tap") {
			this.backCommand();
		}
	};

})();