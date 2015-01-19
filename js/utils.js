(function () {

	Function.prototype.inherits = function(parent) {
		var Surrogate = function() {};
		Surrogate.prototype = parent.prototype;
		this.prototype = new Surrogate();
	}

})();