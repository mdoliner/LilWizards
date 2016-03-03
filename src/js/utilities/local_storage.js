/**
 * Created by Justin on 2015-09-18.
 */
'use strict';
import _ from 'lodash';

var typeConversion = function (str) {
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

Storage = {
  data: {},
};

Storage.get = function (str) {
  return typeConversion(localStorage.getItem(str));
};

Storage.set = function (str, val) {
  if (_.isObject(val)) {
    val = JSON.stringify(val);
  }

  localStorage.setItem(str, val);
};

export default Storage;
