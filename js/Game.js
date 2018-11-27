boomRocket.Game = function(game) {
  this.game = game;
};

boomRocket.Game.prototype = {
    
    init: function(){
        playsiveSDK.gameLoaded();
        this.game.time.advancedTiming = true;
    },

    render: function(){
        this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");   
    },

    destroyPlayer: function(){
        this.player.kill();
        this.jumpTrail.destroy();
        this.fireEngine.destroy();
        this.shipTrail.destroy();
    },

    explode: function(){
        this.playerDeath.emitX = this.player.x;
        this.playerDeath.emitY = this.player.y;
        this.playerDeath.flow(1000, 250, 25, 25,false);
    },

    create: function() { 
        this.changeBgColor();
        this.game.world.setBounds(0,0,this.game.width*4,25000);

        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.beginFill(this.stage.backgroundColor);
        this.graphics.drawRect(0, 0, config.minWidth, config.minHeight);
        this.graphics.endFill();

        this.circle = this.game.add.sprite(0, 0, 'circle');
        this.circle.scale.set(1.5);
        this.circle.anchor.set(0.5);
        this.circle.alpha = 0.3;
        this.circle.x = config.minWidth*0.5;
        this.circle.y = config.minHeight*0.8;

        this.player = this.game.add.sprite(0, 0, 'rocket');
        this.player.anchor.set(0.5);
        this.player.x = config.minWidth*0.5;
        this.player.y = config.minHeight*0.8;
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.game.camera.follow(this.player,Phaser.Camera.FOLLOW_LOCKON,0.1,0.1,0,-this.graphics.height*0.25);
        this.game.camera.focusOn(this.player);
        this.player.body.onWorldBounds = new Phaser.Signal()
        this.player.body.onWorldBounds.add(this.destroyPlayer, this);
        this.player.events.onKilled.add(this.explode,this);

        this.shipTrail = this.game.add.emitter(this.player.x, this.player.y + 25,15);
        this.shipTrail.setScale(0.5, 5, 0.5, 5, 1500, Phaser.Easing.Quadratic.Out);
        this.shipTrail.setAlpha(0.01, 0.3);
        this.shipTrail.setXSpeed(-50, 50);
        this.shipTrail.setYSpeed(-40, 25);
        this.shipTrail.setRotation(100,-100);
        this.shipTrail.makeParticles(this.game.cache.getBitmapData('black'),15);
        this.shipTrail.flow(800, 250, 5, -1,false);

        this.fireEngine = this.game.add.emitter(this.player.x, this.player.y + 20,8);
        this.fireEngine.setScale(1, 2, 1, 2);
        this.fireEngine.setAlpha(0.01, 0.5);
        this.fireEngine.setXSpeed(-4, 4);
        this.fireEngine.setYSpeed(-1, 1);
        this.fireEngine.setRotation(100,-100);
        this.fireEngine.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red')],8);
        this.fireEngine.flow(500, 100, 4, -1,false);

        this.playerDeath = this.game.add.emitter(this.player.x,  this.player.y,25);
        this.playerDeath.setAlpha(0.1, 0.6, 800);
        this.playerDeath.setXSpeed(-250, 250);
        this.playerDeath.setYSpeed(-250, 250);
        this.playerDeath.setRotation(100,-100);
        this.playerDeath.setScale(1, 5, 1, 5, 1000, Phaser.Easing.Quintic.Out);
        this.playerDeath.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red'),this.game.cache.getBitmapData('black')], 25);

        this.jumpTrail = this.game.add.emitter(this.player.x, this.player.y + 10,20);
        this.jumpTrail.setScale(1, 6, 1, 6, 800, Phaser.Easing.Quintic.Out);
        this.jumpTrail.setAlpha(0.01, 0.5);
        this.jumpTrail.setXSpeed(-20, 20);
        this.jumpTrail.setYSpeed(20, -250);
        this.jumpTrail.setRotation(100,-100);
        this.jumpTrail.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red')],20);

        this.tapText = this.game.add.text(0, 0, "TAB TO START", config.textStyle);
        this.tapText.anchor.set(0.5);
        this.tapText.x = config.minWidth*0.5;
        this.tapText.y = config.minHeight*0.725;
        this.tapText.alpha = 0.3;
        this.tapTextTween = this.game.add.tween(this.tapText).to({y:this.tapText.y-this.tapText.height*0.25}, 1000, Phaser.Easing.Quadratic.InOut,true,0,-1,true);

        this.createScore();

        this.game.input.onDown.add(this.start, this); 

        this.graphics.addChild(this.circle);
        this.graphics.addChild(this.tapText);
        this.graphics.addChild(this.player);
        this.graphics.addChild(this.fireEngine);
        this.graphics.addChild(this.jumpTrail);
        this.graphics.addChild(this.shipTrail);
        this.graphics.addChild(this.playerDeath);

        this.game.flexcale.onResize.add(function (scale) {
           this.graphics.scale.set(scale);
           this.scoreText.scale.set(scale);
           this.graphics.alignIn(this.game.world, Phaser.CENTER);
        }.bind(this));

        this.game.flexcale.resize();
        this.graphics.y = this.game.world.height-this.graphics.height;

    },

    start: function(){
        this.circle.kill();
        this.tapText.kill();
        isJumping = false;
        this.player.body.drag.set(50);
        this.player.body.gravity.y = 80;
        this.engineOn();
        this.game.input.onDown.remove(this.start, this);
        this.game.input.onDown.add(this.engineOn, this); 
    },
     
    createScore: function() {
        this.scoreText = this.game.add.text(0, 0, score, config.textStyle2);
        this.scoreText.anchor.set(0.5);
        this.scoreText.x = this.game.width*0.5;
        this.scoreText.y = this.game.height*0.3;
        this.scoreText.alpha = 0.3;
        this.scoreText.fixedToCamera = true;
    },

    incrementScore: function() {
        score += 1;
        this.scoreText.text = score;       
    },

    decrementScore: function() {
        if(score <= 0)return;

        score -= 1;
        this.scoreText.text = score;       
    },

    engineOn: function(pointer){
          if(isJumping) return;

          isJumping = true;
         // this.incrementScore();

          this.jumpTrail.flow(800, 250, 10, 10,false);
          this.game.physics.arcade.accelerationFromRotation(this.player.rotation + 300, 400, this.player.body.velocity);
          //this.player.body.checkCollision.none = true;
          this.game.time.events.add(800,this.engineOff,this);
     },

     engineOff: function(){
          isJumping = false;
          this.player.body.acceleration.y = 0;
          this.player.body.velocity.y = 0;
          this.player.body.velocity.x = 0;
          this.player.body.moves = true;
     },

    update: function(){ 
        this.jumpTrail.emitX = this.player.x;
        this.jumpTrail.emitY = this.player.y + 10;
        this.shipTrail.emitX = this.player.x;
        this.shipTrail.emitY = this.player.y + 25;
        this.fireEngine.emitX = this.player.x;
        this.fireEngine.emitY = this.player.y + 20;

        this.scoreText.text = Math.abs(parseInt(this.player.y/288)-2);

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
        hueValue = this.game.rnd.realInRange(0,1);

        if(hueValue >= 10)
            hueValue = 0;
        var color = Phaser.Color.HSVtoRGB(hueValue,0.5,0.7);
        this.game.stage.backgroundColor =  Phaser.Color.RGBtoString(color.r,color.g,color.b,255,'#');
    }
};