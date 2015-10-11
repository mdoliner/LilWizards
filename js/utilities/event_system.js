(function() {
  if (window.LW == null) {
    window.LW = {};
  }

  var EventSystem = LW.EventSystem = function() {
    this._events = {};
    this._state = {};
  };

  //var ESInit = function(obj) {
  //  obj._events = obj._events || {};
  //};

  EventSystem.on = function(event, callback) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(callback);
    return this;
  };

  EventSystem.trigger = function(event) {
    var args = [].slice.call(arguments, 1);
    if (!this._events || !this._events[event]) return;
    for (var i = 0, n = this._events[event].length; i < n; i++) {
      var cb = this._events[event][i];
      cb.apply(this, args);
    }

    return this;
  };

  EventSystem.off = function(event, cb) {
    if (event == null) {
      this._events = {};
    } else if (cb == null) {
      this._events[event] = [];
    } else {
      var idx = this._events[event].indexOf(cb);
      if (~idx) return;
      this._events[event].splice(idx, 1);
    }

    return this;
  };

  EventSystem.state = function(getter, setter) {
    this._state = this._state || {};
    if (typeof setter !== 'undefined') {
      this._state[getter] = !!setter;
      return this;
    }

    return !!this._state[getter];
  };

  EventSystem.when = function(whenString) {
    var _this = this;
    var prefix = whenString.charAt(0);
    if (prefix === '=' || prefix === '!') {
      this._state = this._state || {};
      whenString = whenString.slice(1);
      var bool = prefix === '!';
      return {
        on: function(event, cb) {
          EventSystem.on.call(_this, event, function() {
            if (this.state(whenString) === bool) return;
            return cb.apply(this, arguments);
          });

          return _this;
        },
      };
    } else {
      return {
        on: function(event, cb) {
          EventSystem.on.call(_this, event, function() {
            if (!this[whenString].call(this)) return;
            return cb.apply(this, arguments);
          });

          return _this;
        },
      };
    }
  };

  EventSystem.prototype.on = EventSystem.on;
  EventSystem.prototype.off = EventSystem.off;
  EventSystem.prototype.trigger = EventSystem.trigger;
  EventSystem.prototype.state = EventSystem.state;
  EventSystem.prototype.when = EventSystem.when;

})();
