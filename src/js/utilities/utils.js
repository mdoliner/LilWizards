(function() {

  window.Util = {};
  window.Mixin = {};

  // Function Functions

  Util.inherits = function(child, parent) {
    child.prototype = Object.create(parent.prototype);
  };

  Util.include = function(child, extra) {
    //Util.extend(child.prototype, extra);
    _.extend(child.prototype, extra);
  };

  Util.args = function(fn) {
    var slice = Array.prototype.slice;
    var bindArgs = slice.call(arguments, 1);
    return function() {
      var callArgs = slice.call(arguments);
      return fn.apply(this, bindArgs.concat(callArgs));
    };
  };

  Util.fnExtend = function(instanceAttributes, classAttributes) {
    var parent = this;
    var child;

    if (instanceAttributes && instanceAttributes.hasOwnProperty('constructor')) {
      child = instanceAttributes.constructor;
    } else {
      child = function() { return parent.apply(this, arguments); };
    }

    // extend static props here.
    _.extend(child, parent, classAttributes);

    var Surrogate = function() { this.constructor = child; };

    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (instanceAttributes) _.extend(child.prototype, instanceAttributes);

    child.__parent__ = parent.prototype;
    return child;
  };

  // Array Prototyping

  // String Prototyping

  Util.capitalizeDashes = function(str) {
    var words = str.split('-');
    return words.map(function(el) {
      return el.charAt(0).toUpperCase() + el.slice(1);
    }).join(' ');
  };

  Util.spaceCapitalize = function(str) {
    var str2 = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    return str2;
  };

  Util.makeReadable = function(str) {
    return Util.spaceCapitalize(Util.capitalizeDashes(str));
  };

  // Object Prototyping

  Util.extend = function(thisObj, otherObj) {
    var args = [].slice.call(arguments);
    if (args.length > 2) {
      Util.extend.apply(this, args.slice(1));
    }

    for (var attr in otherObj) {
      if (!otherObj.hasOwnProperty(attr)) continue;
      thisObj[attr] = otherObj[attr];
    }

    return thisObj;
  };

  Util.clone = function(obj) {
    return Util.extend(obj.constructor(), obj);
  };

  // Mixin Functions

  Mixin.try = function(fn) {
    if (fn instanceof Function) {
      return fn.bind(this)();
    } else {
      return fn;
    }
  };

})();
