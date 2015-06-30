window.$ = window.jQuery = require('./js/vendor/jquery-2.1.3.js');

$(function () {
  mixinEverything();

  LW.GlobalSL = new LW.SoundLibrary();
  LW.GlobalSL.playBGM("Dig-It.mp3");
  LW.AllPlayers = [
    new LW.Player({
      controllerType: "keyboard",
      controllerIndex: 0,
      wizard: new LW.PseudoWizard()
    }),
    new LW.Player({
      controllerType: "keyboard",
      controllerIndex: 1,
      wizard: new LW.PseudoWizard()
    })
  ];
  LW.Menus.TopMenu.swapTo({selector: '.main-menu-items'});
  var gamepadLength = 0;
  LW.getAllPlayers = setInterval(function () {
    if (Gamepad.gamepads.length > gamepadLength) {
      for (var i = gamepadLength; i < Gamepad.gamepads.length; i++) {
        LW.AllPlayers.push(new LW.Player({
          controllerType: "gamepad",
          controllerIndex: i,
          wizard: new LW.PseudoWizard()
        }))
        gamepadLength++;
      }
    }
  }, 1000);
});

var mixinEverything = function () {
  for (var attr in LW) {
    var fn = LW[attr];
    if (fn instanceof Function) {
      Util.include(fn, Mixin);
    }
  }
};

var songs = [
  "Castlemania.mp3",
  "Full-Circle.mp3",
  "battle.mp3"
]

var backgrounds = {
  Library: "bg_bookcase.jpg",
  Cemetery: "bg-cemetery.png",
  Boarwarts: "bg_boarwarts.jpg"
}

LW.runGame = function (selectedLevel, nlevel, isDemo) {
  LW.GlobalSL.playSE('menu-select.ogg', 100)

  $('.main-menu').addClass("hidden");

  var song = songs[Math.floor(songs.length * Math.random())]
  LW.GlobalSL.playBGM(song);
  var fgcanvas = document.getElementById("game-fg-canvas");
  var fgctx = fgcanvas.getContext('2d');
  var bgcanvas = document.getElementById("game-bg-canvas");
  var bgctx = bgcanvas.getContext('2d');
  var game = new LW.Game({
    level: selectedLevel,
    background: backgrounds[nlevel]
  });

  if (LW.Players.length === 1) {
    LW.Players.push(new LW.Player({
      controllerType: "computer",
      controllerIndex: 0,
      spellList: LW.Player.randomSpellList(),
      wizardGraphic: LW.Sprite.WIZARDS[0]
    }))
    LW.Players.push(new LW.Player({
      controllerType: "computer",
      controllerIndex: 1,
      spellList: LW.Player.randomSpellList(),
      wizardGraphic: LW.Sprite.WIZARDS[0]
    }))
    LW.Players.push(new LW.Player({
      controllerType: "computer",
      controllerIndex: 2,
      spellList: LW.Player.randomSpellList(),
      wizardGraphic: LW.Sprite.WIZARDS[0]
    }))
    LW.Players.slice(1).forEach(function (player) {
      player.nextSprite(1);
    })
  }
  for (var i = 0; i < LW.Players.length; i++) {
    game.wizards.push(LW.Players[i].makeWizard({
      game: game
    }));
  }
  var gameView = new LW.GameView(bgctx, fgctx, game);
  gameView.isDemo = isDemo;
  gameView.startGame();
  bgm.play();
};
