(function () {
  if (window.LW === undefined) {
    window.LW = {};
  }

  var GameView = LW.GameView = function (bgctx, fgctx, game) {
    this.game = game;
    this.fgctx = fgctx;
    this.bgctx = bgctx;
    this.MS = Date.now();
    this.fps = {
      startTime : 0,
      frameNumber : 0,
      element: $('div.fps-counter'),
      getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
          currentTime = ( d - this.startTime ) / 1000,
          result = Math.floor( ( this.frameNumber / currentTime ) );

        if( currentTime > 1 ){
          this.startTime = new Date().getTime();
          this.frameNumber = 0;
        }
        return result;

      } 
    };
    this.updateFPS = 0;
    this.isDrawFrame = true;
  };

  GameView.prototype.startGame = function () {
    var gameStep = function () {
      this.checkPlayerActions();
      this.wizardActions();
      this.game.step();
      this.fps.element.html("FPS: "+this.fps.getFPS())
      if (this.game.gameEnded) {
        this.remove();
        $('.main-menu').removeClass("hidden");
        LW.Menus.Character.swapTo({selector: '.main-menu-items'});
      }
    }.bind(this)
    this.gameInterval = setInterval(gameStep, 1000/120);
    this.drawInterval = setInterval(this.game.draw.bind(this.game, this.fgctx, this.bgctx), 1000/60);
  };

  GameView.prototype.remove = function () {
    clearInterval(this.gameInterval);
    clearInterval(this.drawInterval);
    this.fps.element.html("");
    var bgm = $('#bgm')
    bgm[0].pause();
    bgm.attr('src',"audio/BGM/Dig-it.mp3");
    bgm[0].volume = 0.2;
    bgm[0].play();
    for (var i = 0; i < LW.Players.length; i++) {
      if (LW.Players[i].controllerType === "computer") {
        LW.Players.splice(i,1);
        i--;
      }
    }
  };

  GameView.prototype.checkPlayerActions = function () {
    for (var i = 0; i < LW.Players.length; i++) {
      LW.Players[i].checkControllerActions();
    }
  };

  GameView.prototype.wizardActions = function () {
    var wizards = this.game.wizards;
    for (var i = 0; i < wizards.length; i++) {
      var wizard = wizards[i];
      if (wizard.isDead()) {continue;}
      if (wizard.actions["jump"] === "tap") {
        wizard.jump(LW.Wizard.BASEJUMP);
      }
      if (wizard.actions["jump"] === "hold") {
        wizard.dynamicJump();
      }
      if (wizard.actions["up"] === "tap") {
        wizard.faceDir("up");
      } else if (wizard.actions["up"] === "release") {
        wizard.verFacing = null;
      }
      if (wizard.actions["down"] === "tap") {
        wizard.faceDir("down");
      } else if (wizard.actions["down"] === "release") {
        wizard.verFacing = null;
      }
      for (var spellIndex = 0; spellIndex < wizard.actions["spells"].length; spellIndex ++) {
        if (wizard.actions["spells"][spellIndex] === "tap") {
          wizard.castSpell(spellIndex);
        }
      }
    }
  };

})();
