(function () {
	if (window.LW === undefined) {
		window.LW = {};	
	}

	var MainMenu = LW.MainMenu = function (options) {
		for (var attr in options) {
			this[attr] = options[attr];
		}
	};

	MainMenu.prototype.swapTo = function (options) {
		$(options.selector).empty();
		this.addItems(options.selector);
	};

	MainMenu.prototype.addItems = function (selector) {
		for (var i = 0; this.commands.length > i; i++) {
			command = this.commands[i];
			var $li = $('<li>');
			$li.addClass('menu-item')
			$li.addClass(command);
			if (i === 0) {
				$li.addClass('selected');
			}
			$li.html(command);
			$(selector).append($li);
			$("."+command).on("click", this.events[command]);
		};
	};



})();