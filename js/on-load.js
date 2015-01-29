$(document).ready( function () {
  LW.GlobalSL = new LW.SoundLibrary();
  LW.GlobalSL.playBGM("Dig-It.mp3", 20);
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