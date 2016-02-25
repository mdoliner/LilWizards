if (window.require) {
  window.$ = window.jQuery = require('./vendor/jquery-2.1.3.js');
}

//var LEVEL_XML = $.parseXML(require('data/levels.xml'));

$(function() {
  mixinEverything();

  if (window.__TEST__) return;

  LW.GlobalSL.playBGM('Dig-It.mp3');
  LW.AllPlayers = [
    new LW.Player({
      controllerType: 'keyboard',
      controllerIndex: 0,
      wizard: new LW.PseudoWizard(),
    }),
    new LW.Player({
      controllerType: 'keyboard',
      controllerIndex: 1,
      wizard: new LW.PseudoWizard(),
    }),
  ];
  LW.Menus.TopMenu.swapTo({selector: '.main-menu-items'});
  var gamepadLength = 0;
  LW.getAllPlayers = setInterval(function() {
    if (Gamepad.gamepads.length > gamepadLength) {
      for (var i = gamepadLength; i < Gamepad.gamepads.length; i++) {
        LW.AllPlayers.push(new LW.Player({
          controllerType: 'gamepad',
          controllerIndex: i,
          wizard: new LW.PseudoWizard(),
        }));
        gamepadLength++;
      }
    }
  }, 1000);
});

var mixinEverything = function() {
  for (var attr in LW) {
    if (!LW.hasOwnProperty(attr)) continue;
    var fn = LW[attr];
    if (fn instanceof Function) {
      Util.include(fn, Mixin);
    }
  }
};

var songs = [
  'Castlemania.mp3',
  'Full-Circle.mp3',
  'battle.mp3',
];

var backgrounds = {
  Library: require('graphics/bg_bookcase.jpg'),
  Cemetery: require('graphics/bg-cemetery.png'),
  Boarwarts: require('graphics/bg_boarwarts.jpg'),
  Spikes: require('graphics/bg_boarwarts.jpg'),
};
