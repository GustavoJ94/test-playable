boomRocket.Game = function(game) {
  this.game = game;
  this.player;
};

boomRocket.Game.prototype = {
    
    init: function(){
        playsiveSDK.gameLoaded();
    },

    create: function() { 
        this.changeBgColor();

        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.beginFill(0x000000);
        this.graphics.drawRect(0, 0, config.minWidth, config.minHeight);
        this.graphics.endFill();

        this.game.world.setBounds(-5000,0,5000,5000);
        this.circle = this.game.add.sprite(0, 0, 'circle');
        this.circle.scale.set(1.5);
        this.circle.anchor.set(0.5);
        this.circle.alpha = 0.3;
        this.circle.x = config.minWidth*0.5;
        this.circle.y = config.minHeight*0.8;

        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'rocket');
        this.player.anchor.set(0.5);
        this.player.x = config.minWidth*0.5;
        this.player.y = config.minHeight*0.8;
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.game.camera.focusOn(this.player);
        this.game.camera.follow(this.player,null,0.1,0.1,0,-this.graphics.height*0.25);

        this.tapText = this.game.add.text(0, 0, "TAB TO START", config.textStyle);
        this.tapText.anchor.set(0.5);
        this.tapText.x = config.minWidth*0.5;
        this.tapText.y = config.minHeight*0.725;
        this.tapText.alpha = 0.3;
        this.tapTextTween = this.game.add.tween(this.tapText).to({y:this.tapText.y-this.tapText.height*0.25}, 1000, Phaser.Easing.Quadratic.InOut,true,0,-1,true);

        this.scoreText = this.game.add.text(0, 0, score, config.textStyle2);
        this.scoreText.anchor.set(0.5);
        this.scoreText.x = this.game.width*0.5;
        this.scoreText.y = this.game.height*0.3;
        this.scoreText.alpha = 0.3;
        this.scoreText.fixedToCamera = true;

        this.game.input.onDown.add(this.start, this); 

        this.graphics.addChild(this.circle);
        this.graphics.addChild(this.tapText);
        this.graphics.addChild(this.player);

        this.game.flexcale.onResize.add(function (scale) {
           this.graphics.scale.set(scale);
           this.scoreText.scale.set(scale);
           this.graphics.alignIn(this.game.world, Phaser.CENTER);
        }.bind(this));

        this.game.flexcale.resize();
    },

    start: function(){
        this.circle.kill();
        this.tapText.kill();
        isJumping = false;
        this.player.body.drag.set(80);
        this.player.body.gravity.y = 100;
        this.engineOn();
        this.game.input.onDown.remove(this.start, this);
        this.game.input.onDown.add(this.engineOn, this); 
        this.game.input.onUp.add(this.engineOff, this); 
    },
     
    createScore: function() {
        this.scoreLabel = this.game.add.sprite(this.game.width*0.3, 95, 'score');

        this.score = this.game.add.text(this.scoreLabel.x+this.scoreLabel.width*1.2, 92, '' + score, { 
            font: "40px sans-serif", fill: "#ED008D", stroke:"#ED008D", strokeThickness:"2"
        }); 
        this.scoreLabelTween = this.add.tween(this.score.scale).to({
            x: 1.3,
            y: 1.3
        }, 200, Phaser.Easing.Linear.In).to({
            x: 1,
            y: 1
        }, 200, Phaser.Easing.Linear.In);
        this.score.align = 'center'
    },

    incrementScore: function(point) {
        score += 1;
        this.score.text = score;        

        if(!this.scoreLabelTween.isRunning)
            this.scoreLabelTween.start();
    },

    engineOn: function(pointer){
          if(isJumping) return;

          isJumping = true;
          this.game.physics.arcade.accelerationFromRotation(this.player.rotation + 300, 500, this.player.body.velocity);
          //this.player.body.checkCollision.none = true;
          this.game.time.events.add(1000,function(){isJumping = false;},this);
     },

     engineOff: function(){
          this.player.body.acceleration.y = 0;          
     },

    update: function(){        
        if(isJumping == false){
          this.player.angle += rotationSpeed * (this.game.time.elapsed/1000);

          if(this.player.angle > config.angleLimit){
              this.player.angle = config.angleLimit;
              rotationSpeed *= -1;
          }
          else if(this.player.angle < -config.angleLimit){
              this.player.angle = -config.angleLimit;
              rotationSpeed *= -1;
          }
        }

        if(this.player.y > config.minHeight + this.player.height){
               console.log("game over");    
          }
    },

    changeBgColor: function(){
        hueValue += 0.2;

        if(hueValue >= 10)
            hueValue = 0;
        var color = Phaser.Color.HSVtoRGB(hueValue,0.5,0.7);
        this.game.stage.backgroundColor =  Phaser.Color.RGBtoString(color.r,color.g,color.b,255,'#');
    }
};