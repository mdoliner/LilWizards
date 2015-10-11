/**
 * Created by Justin on 2015-09-18.
 */
(function() {
  if (window.LW == null) {
    window.LW = {};
  }

  var typeConversion = function(str) {
    if (str == null) {
      return str;
    }

    if (Number(str) == str) {
      return Number(str);
    }

    var val;
    try {
      val = JSON.parse(str);
    } catch (e) {
      val = str;
    }

    return val;
  };

  LW.Storage = {
    data: {},
  };

  LW.Storage.get = function(str) {
    return typeConversion(localStorage.getItem(str));
  };

  LW.Storage.set = function(str, val) {
    if (_.isObject(val)) {
      val = JSON.stringify(val);
    }

    localStorage.setItem(str, val);
  };

})();
