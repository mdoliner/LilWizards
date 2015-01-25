(function () {

	// Function Prototyping

	Function.prototype.inherits = function(parent) {
		var Surrogate = function() {};
		Surrogate.prototype = parent.prototype;
		this.prototype = new Surrogate();
	}

	Function.prototype.args = function () {
		var slice = Array.prototype.slice;
		var bindArgs = slice.call(arguments);
		var fn = this;
		return function () {
			var callArgs = slice.call(arguments);
			return fn.apply(this, bindArgs.concat(callArgs));
		}
	}

	// Array Prototyping

	// String Prototyping

	String.prototype.capitalizeDashes = function () {
		var words = this.split("-");
		return words.map(function (el) {
			return el.charAt(0).toUpperCase() + el.slice(1);
		}).join(" ")
	};

	String.prototype.spaceCapitalize = function () {
		var str = this.replace(/([a-z])([A-Z])/g, '$1 $2');
		return str;
	};

	String.prototype.makeReadable = function () {
		return this.capitalizeDashes().spaceCapitalize();
	};

	// Object Prototyping

	// Object.prototype.extendAttributes = function (otherObj) {
	// 	for (var attr in otherObj) {
	// 		this[attr] = otherObj[attr];
	// 	}
	// 	return this;
	// };

})();