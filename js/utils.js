(function () {

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

})();