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
        //this.game.debug.cameraInfo(this.game.camera,2,14);
        //this.circleObstacles.forEach(function(obj){this.game.debug.body(obj);},this);
        //this.game.debug.body(this.player);
    },

    restart: function(){
        score = 0;
        isJumping = true;
        this.gameOver = false;
        this.player.reset(config.minWidth*0.5,config.minHeight*0.8);
        this.player.angle = 0;
        this.player.body.allowGravity = false;
        this.game.camera.focusOn(this.player);
        this.jumpTrail.revive();
        this.fireEngine.revive();
        this.shipTrail.revive();
        this.circle.revive();
        this.tapText.revive();
        this.scoreText.alpha = 0.3;
        this.game.input.onDown.remove(this.engineOn, this);
        this.game.input.onDown.add(this.start, this); 
    },  

    destroyPlayer: function(){
        this.gameOver = true;
        this.scoreText.bringToTop();
        this.scoreText.alpha = 1;
        this.player.kill();
        this.jumpTrail.kill();
        this.fireEngine.kill();
        this.shipTrail.kill();
        this.game.time.events.add(500,this.sendScore,this);
    },

    sendScore: function(){
        playsiveSDK.postScore(score);
        this.game.time.events.add(1000,this.restart,this);
    },

    explode: function(){
        this.playerDeath.emitX = this.player.x;
        this.playerDeath.emitY = this.player.y;
        this.playerDeath.flow(600, 250, 35, 35,false);
    },

    createRectangles: function(){
        this.squareObstacles = this.game.add.group();
        this.squareObstacles.enableBody = true;
        this.game.physics.enable(this.squareObstacles, Phaser.Physics.ARCADE);
        this.squareObstacles.createMultiple(10, 'square');

        this.squareObstacles.forEach(function(square){
            var randomSize = this.game.rnd.realInRange(0.5,0.2);
            square.scale.set(square.scale.x * randomSize, square.scale.y * randomSize * 4);
        },this);
        
    },

    createCircles: function(){
        this.circleObstacles = this.game.add.group();
        this.circleObstacles.enableBody = true;
        this.game.physics.enable(this.circleObstacles, Phaser.Physics.ARCADE);
        this.circleObstacles.createMultiple(6, 'spike');

        this.circleObstacles.forEach(function(circle){
            var randomSize = this.game.rnd.realInRange(0.5,1);
            circle.scale.set(circle.scale.x * randomSize, circle.scale.y * randomSize);
        },this);
        
    },

    addRectangles: function(){
        var square = this.squareObstacles.getFirstDead();
        square.anchor.set(0.5);
        square.body.enable = true;
        square.body.allowRotation = true;
        square.speed = this.game.rnd.between(-25,25);
        square.body.immovable = true;
        square.body.setSize(square.width,square.height,0,0);
        square.angle = this.game.rnd.between(0,90);
        square.reset(this.game.rnd.between(-this.game.width*0.5,this.game.width),this.game.rnd.between(-this.game.height*0.7,this.game.height*0.3));
    },

    addCircles: function(){
        var circle = this.circleObstacles.getFirstDead();
        circle.anchor.set(0.5);
        circle.body.enable = true;
        circle.speed = this.game.rnd.between(-25,25);
        circle.body.immovable = true;
        circle.reset(this.game.rnd.between(-this.game.width*0.5,this.game.width),this.game.rnd.between(-this.game.height*0.7,this.game.height*0.3));
        circle.body.setCircle(circle.width*0.4, (-(circle.width*0.4) + 0.5 * circle.width  / circle.scale.x),(-(circle.width*0.4) + 0.5 * circle.height / circle.scale.y));
    },

    makeObstacles: function(){
        for(var i = 0; i<this.squareObstacles.children.length; i++){
            this.addRectangles();
        }

        for(var i = 0; i<this.circleObstacles.children.length; i++){
            this.addCircles();
        }
    },

    create: function() { 
        this.gameOver = false;
        this.changeBgColor();
        this.game.world.setBounds(0,0,this.game.width*4,25000);

        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.beginFill(this.stage.backgroundColor);
        this.graphics.drawRect(0, 0, config.minWidth, config.minHeight);
        this.graphics.endFill();

        this.createRectangles();
        this.createCircles();
        this.createStartUi();
        this.createScore();
        this.makeObstacles();
        this.createPlayer();

        this.game.input.onDown.add(this.start, this); 

        this.graphics.addChild(this.circle);
        this.graphics.addChild(this.tapText);
        this.graphics.addChild(this.player);
        this.graphics.addChild(this.squareObstacles);
        this.graphics.addChild(this.circleObstacles);
        this.graphics.addChild(this.playerDeath);

        this.game.flexcale.onResize.add(function (scale) {
           this.graphics.scale.set(scale);
           this.scoreText.scale.set(scale);
           this.graphics.alignIn(this.game.world, Phaser.CENTER);
        },this);

        this.game.flexcale.resize();
        this.graphics.y = this.game.world.height-this.graphics.height;
    },

    start: function(){
        this.circle.kill();
        this.tapText.kill();
        isJumping = false;
        this.player.body.allowGravity = true;
        this.player.body.drag.set(50);
        this.player.body.gravity.y = 80;
        this.engineOn();
        this.game.input.onDown.remove(this.start, this);
        this.game.input.onDown.add(this.engineOn, this); 
    },

    createStartUi: function(){
        this.circle = this.game.add.sprite(0, 0, 'circle');
        this.circle.scale.set(1.5);
        this.circle.anchor.set(0.5);
        this.circle.alpha = 0.3;
        this.circle.x = config.minWidth*0.5;
        this.circle.y = config.minHeight*0.8;

        this.tapText = this.game.add.text(0, 0, "TAB TO START", config.textStyle);
        this.tapText.anchor.set(0.5);
        this.tapText.x = config.minWidth*0.5;
        this.tapText.y = config.minHeight*0.725;
        this.tapText.alpha = 0.3;
        this.tapTextTween = this.game.add.tween(this.tapText).to({y:this.tapText.y-this.tapText.height*0.25}, 1000, Phaser.Easing.Quadratic.InOut,true,0,-1,true);
    },

    createPlayer: function(){
        this.player = this.game.add.sprite(0, 0, 'rocket');
        this.player.anchor.set(0.5);
        this.player.x = config.minWidth*0.5;
        this.player.y = config.minHeight*0.8;
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(this.player.width*0.7,this.player.height*0.7,this.player.width*0.15,this.player.height*0.15);
        this.game.camera.follow(this.player,Phaser.Camera.FOLLOW_LOCKON,1,1,0,-this.graphics.height*0.25);
        this.game.camera.focusOn(this.player);
        this.player.body.onWorldBounds = new Phaser.Signal()
        this.player.body.onWorldBounds.add(this.destroyPlayer, this);
        this.player.events.onKilled.add(this.explode,this);

        this.shipTrail = this.game.add.emitter(0,  25,15);
        this.shipTrail.setScale(0.5, 5, 0.5, 5, 1500, Phaser.Easing.Quadratic.Out);
        this.shipTrail.setAlpha(0.01, 0.6, 3000 ,Phaser.Easing.Linear.InOut);
        this.shipTrail.setXSpeed(-50, 50);
        this.shipTrail.setYSpeed(-10, 40);
        this.shipTrail.setRotation(100,-100);
        this.shipTrail.makeParticles(this.game.cache.getBitmapData('black'),15);
        this.shipTrail.flow(800, 250, 5, -1,false);

        this.fireEngine = this.game.add.emitter(0, 20,8);
        this.fireEngine.setScale(1, 2, 1, 2);
        this.fireEngine.setAlpha(0.01, 0.5);
        this.fireEngine.setXSpeed(-6, 6);
        this.fireEngine.setYSpeed(0, -5);
        this.fireEngine.setRotation(100,-100);
        this.fireEngine.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red')],8);
        this.fireEngine.flow(200, 100, 6, -1,false);

        this.playerDeath = this.game.add.emitter(this.player.x,  this.player.y,35);
        this.playerDeath.setAlpha(0.1, 0.6, 800);
        this.playerDeath.setXSpeed(-250, 250);
        this.playerDeath.setYSpeed(-250, 250);
        this.playerDeath.setRotation(50,-100);
        this.playerDeath.setScale(1, 5, 1, 5, 1000, Phaser.Easing.Quintic.Out);
        this.playerDeath.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red'),this.game.cache.getBitmapData('black')], 35);

        this.jumpTrail = this.game.add.emitter(0, 20,30);
        this.jumpTrail.setScale(1, 6, 1, 6, 800, Phaser.Easing.Quintic.Out);
        this.jumpTrail.setAlpha(0.01, 0.5);
        this.jumpTrail.setXSpeed(-25, 25);
        this.jumpTrail.setYSpeed(10, 1000);
        this.jumpTrail.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red')],30);
        this.player.addChild(this.jumpTrail);
        this.player.addChild(this.shipTrail);
        this.player.addChild(this.fireEngine);
    },
     
    createScore: function() {
        this.scoreText = this.game.add.text(0, 0, 0, config.textStyle2);
        this.scoreText.anchor.set(0.5);
        this.scoreText.x = this.game.width*0.5;
        this.scoreText.y = this.game.height*0.3;
        this.scoreText.alpha = 0.3;
        this.scoreText.fixedToCamera = true;
    },

    engineOn: function(){
          if(isJumping || this.gameOver) return;

          isJumping = true;

          this.jumpTrail.flow(400, 250, 15, 15,false);
          this.game.physics.arcade.accelerationFromRotation(this.player.rotation + 300, 400, this.player.body.velocity);
          //this.player.body.checkCollision.none = true;
          this.game.time.events.add(800,this.engineOff,this);
     },

     engineOff: function(){
          isJumping = false;
          this.player.body.acceleration.y = 0;
          this.player.body.velocity.y = 0;
          this.player.body.velocity.x = 0;
     },

    update: function(){ 
        score = Math.abs(parseInt(this.player.y/288)-2);
        this.scoreText.text = score;

        this.squareObstacles.forEach(function(square){
            square.angle += square.speed * (this.game.time.elapsed/1000);
        },this);

        this.circleObstacles.forEach(function(circle){
            circle.angle += circle.speed * (this.game.time.elapsed/1000);
        },this);

        this.game.physics.arcade.collide(this.player, [this.circleObstacles,this.squareObstacles], this.destroyPlayer, null, this);

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
    },

    changeBgColor: function(){
        hueValue = this.game.rnd.realInRange(0,1);

        if(hueValue >= 10)
            hueValue = 0;
        var color = Phaser.Color.HSVtoRGB(hueValue,0.5,0.7);
        this.game.stage.backgroundColor =  Phaser.Color.RGBtoString(color.r,color.g,color.b,255,'#');
    }
};