(function () {

	window.Util = {};

	// Function Functions

	Util.inherits = function(child, parent) {
		var Surrogate = function() {};
		Surrogate.prototype = parent.prototype;
		this.prototype = new Surrogate();
	};

	Util.args = function (fn) {
		var slice = Array.prototype.slice;
		var bindArgs = slice.call(arguments, 1);
		return function () {
			var callArgs = slice.call(arguments);
			return fn.apply(this, bindArgs.concat(callArgs));
		}
	}

	// Array Prototyping

	// String Prototyping

	Util.capitalizeDashes = function (str) {
		var words = str.split("-");
		return words.map(function (el) {
			return el.charAt(0).toUpperCase() + el.slice(1);
		}).join(" ")
	};

	Util.spaceCapitalize = function (str) {
		var str2 = str.replace(/([a-z])([A-Z])/g, '$1 $2');
		return str2;
	};

	Util.makeReadable = function (str) {
		return Util.spaceCapitalize(Util.capitalizeDashes(str));
	};

	// Object Prototyping

	Util.extend = function (thisObj, otherObj) {
		for (var attr in otherObj) {
			thisObj[attr] = otherObj[attr];
		}
		return thisObj;
	};

})();