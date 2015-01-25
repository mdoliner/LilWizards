(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}

	var QuadView = LW.QuadView = function (options) {
		LW.MainMenu.call(this, options);
		LW.GlobalSL.playSE('menu-select.ogg', 100)
		this.$el = $("<div>");

		this.$menuItemsList = $("<ul class='quad-menu-items'>");
		this.$el.append(this.$menuItemsList);

		this.$playerPicture = $("<figure class='player-picture'>");

		this.$playerSpells = $("<ul class='player-spells'>");
		this.player.spellList.forEach(function (spell) {
			var $spell = $("<li class='player-spell'>");
			if (spell) {
				$spell.html(spell)
			} else {
				$spell.html("-------");
			}
			this.$playerSpells.append($spell);
		}.bind(this));
		this.$el.append(this.$playerSpells);

		this.$parentEl.html(this.$el);
		this.checkingInputs = setInterval(this.checkInput.bind(this), 1000/60);
		this.addItems();
	};

	QuadView.inherits(LW.MainMenu);

	QuadView.prototype.addItems = function () {
		for (var i = 0; this.commands.length > i; i++) {
			command = this.commands[i];
			var $li = $('<li>');
			$li.addClass('quad-menu-item')
			$li.addClass(command);
			if (i === 0) {
				$li.addClass('selected');
			}
			$li.html(command);
			$li.data('command', command);
			this.$menuItemsList.append($li);
			// $li.on("click", this.events[command].bind(this));
		};
	};

	QuadView.prototype.checkInput = function () {
		this.player.checkControllerActions();
		var wizard = this.player.wizard;
		if (wizard.actions["jump"] === "tap") {
			this.executeCommand(-1);
		}
		if (wizard.actions["up"] === "tap") {
			this.selectCommand(-1);
		}
		if (wizard.actions["down"] === "tap") {
			this.selectCommand(1);
		}
		if (wizard.actions["spells"][0] === "tap") {
			this.executeCommand(0);
		}
		if (wizard.actions["spells"][1] === "tap") {
			this.executeCommand(1);
		}
		if (wizard.actions["spells"][2] === "tap") {
			this.executeCommand(2);
		}
	};

	QuadView.prototype.selectCommand = function (num) {
		LW.GlobalSL.playSE('menu-move.ogg', 100);
		var $currentItem = $(this.$menuItemsList.children(".selected")[0]);
		var $menuItems = this.$menuItemsList.children(".quad-menu-item");
		var currentIndex = $menuItems.index($currentItem);
		$currentItem.removeClass("selected");
		var newIndex = (currentIndex + num + $menuItems.length) % $menuItems.length;
		$($menuItems[newIndex]).addClass("selected");
	};

	QuadView.prototype.executeCommand = function (index) {
		var $selected = $(this.$menuItemsList.children(".selected")[0]);
		if (!$selected.data('command')) {return;}
		this.events[$selected.data('command')].bind(this)(index);
	};

	QuadView.prototype.remove = function () {
		clearInterval(this.checkingInputs);
		this.childQuad && this.childQuad.remove();
	};

})();