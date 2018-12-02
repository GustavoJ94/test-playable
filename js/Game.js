boomRocket.Game = function(game) {
  this.game = game;
};

boomRocket.Game.prototype = {
    
    init: function(){
        playsiveSDK.gameLoaded();
        this.game.time.desiredFps = config.desiredFPS;
    },

    restart: function(){
        score = 0;
        isJumping = true;
        this.gameOver = false;
        this.isStart = false;
        this.scoreText.text = 0;
        this.player.reset(config.minWidth*0.5,config.minHeight*0.8);
        this.player.body.allowGravity = false;
        this.player.angle = 0;
        this.player.shield = false;
        this.shipTrail.emitX = this.player.x;
        this.shipTrail.emitY = this.player.y + 25;
        this.fireEngine.emitX = this.player.x;
        this.fireEngine.emitY = this.player.y + 20;
        this.game.camera.focusOn(this.player);
        this.jumpTrail.revive();
        this.circle.revive();
        this.circle1.revive();
        this.circle2.revive();
        this.tapText.revive();
        this.shipTrail.flow(800, 250, 5, -1,false);
        this.fireEngine.flow(200, 100, 6, -1,false);
        this.scoreText.alpha = 0.3;
        this.restartObstacles();
        this.game.input.onDown.remove(this.engineOn, this);
        this.game.input.onDown.add(this.start, this); 
    },  

    destroyPlayer: function(){
        this.gameOver = true;
        this.scoreText.alpha = 1;
        this.player.kill();
        this.jumpTrail.kill();
        this.game.time.events.add(500,this.sendScore,this);
    },

    sendScore: function(){
        playsiveSDK.postScore(score);
        this.game.time.events.add(1000,this.restart,this);
    },

    explode: function(){
        this.playerDeath.emitX = this.player.x;
        this.playerDeath.emitY = this.player.y;
        this.playerDeath2.emitX = this.player.x;
        this.playerDeath2.emitY = this.player.y;
        this.circle1.x = this.player.x;
        this.circle1.y = this.player.y;
        this.circle2.x = this.player.x;
        this.circle2.y = this.player.y;
        this.circle1.alpha = 0.3;
        this.circle2.alpha = 0.3;
        this.circle1.effectDot.start();
        this.circle1.effectDot2.start(); 
        this.circle2.effectDot.start(); 
        this.circle2.effectDot2.start(); 
        this.playerDeath.flow(600, 250, 20, 20,false);
        this.playerDeath2.flow(600, 250, 10, 10,false);
    },

    createRectangles: function(){
        this.squareObstacles = this.game.add.group();
        this.squareObstacles.enableBody = true;
        this.game.physics.enable(this.squareObstacles, Phaser.Physics.ARCADE);
        this.squareObstacles.createMultiple(config.rectangles, 'square');

        this.squareObstacles.forEach(function(square){
            var randomSize = this.game.rnd.realInRange(0.2,0.8);
            square.scale.set(square.scale.x * randomSize, square.scale.y * randomSize * 2);
        },this);
        
    },

    createItems: function(){
        this.items = this.game.add.group();
        this.items.enableBody = true;
        this.game.physics.enable(this.items, Phaser.Physics.ARCADE);
        this.items.createMultiple(config.items, 'item');  
    },

    createCircles: function(){
        this.circleObstacles = this.game.add.group();
        this.circleObstacles.enableBody = true;
        this.game.physics.enable(this.circleObstacles, Phaser.Physics.ARCADE);
        this.circleObstacles.createMultiple(config.spikes, 'spike');

        this.circleObstacles.forEach(function(circle){
            var randomSize = this.game.rnd.realInRange(0.5,1.5);
            circle.scale.set(circle.scale.x * randomSize, circle.scale.y * randomSize);
        },this);
        
    },

    addRectangles: function(){
        var square = this.squareObstacles.getFirstDead();
        square.anchor.set(0.5);
        square.speed = this.game.rnd.between(-35,35);
        square.body.immovable = true;
        square.angle = this.game.rnd.between(0,90);
        square.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.8,this.player.y-this.game.height*0.3));
        square.body.setCircle(square.width*1.5, (-(square.width*1.5) + 0.5 * square.width  / square.scale.x),(-(square.width*1.5) + 0.5 * square.height / square.scale.y));
    },

    addCircles: function(){
        var circle = this.circleObstacles.getFirstDead();
        circle.anchor.set(0.5);
        circle.speed = this.game.rnd.between(-25,25);
        circle.body.immovable = true;
        circle.body.allowGravity = false;

        circle.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.8,this.player.y-this.game.height*0.8));
        
        if(this.game.device.desktop)
            var radius = circle.width*0.45;
        else
            var radius = circle.width*0.95;

        circle.body.setCircle(radius, (-radius + 0.5 * circle.width  / circle.scale.x),(-radius + 0.5 * circle.height / circle.scale.y));
    },

     addItems: function(){
        var item = this.items.getFirstDead();
        var dot = this.game.add.sprite(0, 0, 'circle');
        dot.anchor.set(0.5);
        dot.scale.set(0.2);
        dot.alpha = 0.4;
        item.anchor.set(0.5);
        item.speed = this.game.rnd.between(10, 25);
        item.animations.add('blink',[1,2,3,4],6,true);
        item.animations.play('blink');       
        item.effectDot = this.game.add.tween(dot).to( { alpha: 0 }, 800, Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
        item.effectDot2 = this.game.add.tween(dot.scale).to( {x:0.4,y:0.4 }, 800, Phaser.Easing.Quadratic.Out, true, 0, -1,true);
        item.addChild(dot);
        item.body.immovable = true;
        item.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.8,this.player.y-this.game.height*0.3));
        var radius = item.width;
        item.body.setCircle(radius, (-radius + 0.5 * item.width  / item.scale.x),(-radius + 0.5 * item.height / item.scale.y));
    },

    makeObstacles: function(){
        for(var i = 0; i<this.squareObstacles.children.length; i++){
            this.addRectangles();
        }

        for(var i = 0; i<this.circleObstacles.children.length; i++){
            this.addCircles();
        }

        for(var i = 0; i<this.items.children.length; i++){
            this.addItems();
        }
    },

    restartObstacles: function(){
        this.squareObstacles.forEach(function(square){
          square.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.8,this.player.y-this.game.height*0.3));
        },this);

        this.circleObstacles.forEach(function(circle){
          circle.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.8,this.player.y-this.game.height*0.8));
        },this);

        this.items.forEach(function(item){
          item.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.8,this.player.y-this.game.height*0.3));
        },this);
    },

    create: function() { 
        this.gameOver = false;
        this.isStart = false;
        this.changeBgColor();
        this.game.world.setBounds(0,0,this.game.width*4,50000);

        this.graphics = this.game.add.graphics(0, 0);
        this.graphics.beginFill(this.stage.backgroundColor);
        this.graphics.drawRect(0, 0, config.minWidth, config.minHeight);
        this.graphics.endFill();

        this.createRectangles();
        this.createCircles();
        this.createItems();
        this.createStartUi();
        this.createScore();
        this.createPlayer();
        this.makeObstacles();

        this.game.input.onDown.add(this.start, this); 

        this.graphics.addChild(this.circle);
        this.graphics.addChild(this.tapText);
        this.graphics.addChild(this.player);
        this.graphics.addChild(this.fireEngine);
        this.graphics.addChild(this.shipTrail);
        this.graphics.addChild(this.squareObstacles);
        this.graphics.addChild(this.circleObstacles);
        this.graphics.addChild(this.items);
        this.graphics.addChild(this.specialPower);
        this.graphics.addChild(this.circle1);
        this.graphics.addChild(this.circle2);
        this.graphics.addChild(this.playerDeath);
        this.graphics.addChild(this.playerDeath2);

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
        this.isStart = true;
        this.player.body.drag.set(50);
        this.player.body.bounce.set(0.8);
        this.player.body.gravity.y = 80;
        this.player.body.allowGravity = true;
        this.engineOn();
        this.game.input.onDown.remove(this.start, this);
        this.game.input.onDown.add(this.engineOn, this); 
    },

    createStartUi: function(){
        this.circle = this.game.add.sprite(0, 0, 'circle');
        this.circle.scale.set(0.4);
        this.circle.anchor.set(0.5);
        this.circle.alpha = 0.3;
        this.circle.x = config.minWidth*0.5;
        this.circle.y = config.minHeight*0.8;

        this.specialPower = this.game.add.emitter(0, 0,150);
        this.specialPower.width = this.game.width;
        this.specialPower.setScale(0.5, 2, 15, 40);
        this.specialPower.setAlpha(0.01, 0.8);
        this.specialPower.setYSpeed(1500, 5000);
        this.specialPower.setXSpeed(-5, 5);
        this.specialPower.setRotation(0,0);
        this.specialPower.makeParticles([this.game.cache.getBitmapData('black'),this.game.cache.getBitmapData('white')],150);

        this.tapText = this.game.add.bitmapText(0, 0,'font', config.startText);
        this.tapText.anchor.set(0.5);
        this.tapText.x = config.minWidth*0.5;
        this.tapText.y = config.minHeight*0.7;
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
        this.player.body.maxVelocity.set(1500);
        this.player.body.maxAngular = 1500;
        this.player.shield = false;

        this.game.camera.follow(this.player,null,1,1,0,0);
        this.game.camera.focusOn(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(this.game.width*0.4, this.game.height*0.6, this.game.width*0.1, this.game.height*0.25);
        this.player.body.onWorldBounds = new Phaser.Signal()
        this.player.body.onWorldBounds.add(this.destroyPlayer, this);
        this.player.events.onKilled.add(this.explode,this);

        this.ground = this.game.add.sprite(0, 0, 'square');
        this.ground.width = this.game.width;
        this.ground.anchor.set(0.5);
        this.ground.x = this.game.width*0.5;
        this.ground.alpha = 0;
        this.ground.y = this.game.camera.deadzone.bottom+this.ground.height+this.game.height*0.1;
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.ground.body.allowGravity = false;
        this.ground.body.inmovable = true;
        this.ground.fixedToCamera = true;

        this.shipTrail = this.game.add.emitter(this.player.x, this.player.y + 25,20);
        this.shipTrail.setScale(2, 5, 2, 5, 1500, Phaser.Easing.Quadratic.Out);
        this.shipTrail.setAlpha(0.01, 0.6, 3000 ,Phaser.Easing.Linear.InOut);
        this.shipTrail.setXSpeed(-50, 50);
        this.shipTrail.setYSpeed(-10, 40);
        this.shipTrail.setRotation(100,-100);
        this.shipTrail.makeParticles(this.game.cache.getBitmapData('black'),20);
        this.shipTrail.flow(800, 250, 10, -1,false);

        this.fireEngine = this.game.add.emitter(this.player.x, this.player.y + 20,8);
        this.fireEngine.setScale(1, 2, 1, 2);
        this.fireEngine.setAlpha(0.01, 0.5);
        this.fireEngine.setXSpeed(-6, 6);
        this.fireEngine.setYSpeed(-5, -5);
        this.fireEngine.setRotation(100,-100);
        this.fireEngine.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red')],8);
        this.fireEngine.flow(200, 100, 6, -1,false);
        
        this.circle1 = this.game.add.sprite(0, 0, 'circle');
        this.circle1.scale.set(0);
        this.circle1.anchor.set(0.5);
        this.circle1.alpha = 0;
        this.circle2 = this.game.add.sprite(0, 0, 'circle');
        this.circle2.scale.set(0);
        this.circle2.anchor.set(0.5);
        this.circle2.alpha = 0;
        this.circle1.effectDot = this.game.add.tween(this.circle1).to( { alpha: 0.05 }, 400, Phaser.Easing.Sinusoidal.Out, false);
        this.circle1.effectDot2 = this.game.add.tween(this.circle1.scale).to( {x:1,y:1}, 400, Phaser.Easing.Quadratic.Out, false);
        this.circle2.effectDot = this.game.add.tween(this.circle2).to( { alpha: 0.05 }, 600, Phaser.Easing.Sinusoidal.Out, false);
        this.circle2.effectDot2 = this.game.add.tween(this.circle2.scale).to( {x:2,y:2}, 600, Phaser.Easing.Quadratic.Out, false);
        this.circle1.effectDot2.onComplete.add(function(){this.circle1.kill();this.circle1.scale.set(0);this.circle1.alpha = 0;},this);
        this.circle2.effectDot2.onComplete.add(function(){this.circle2.kill();this.circle2.scale.set(0);this.circle2.alpha = 0;},this);

        this.playerDeath = this.game.add.emitter(this.player.x,  this.player.y,20);
        this.playerDeath.setAlpha(0.1, 0.6, 800);
        this.playerDeath.setXSpeed(-300, 300);
        this.playerDeath.setYSpeed(-300, 300);
        this.playerDeath.setRotation(50,-100);
        this.playerDeath.setScale(1, 5, 1, 5, 1000, Phaser.Easing.Quintic.Out);
        this.playerDeath.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red'),this.game.cache.getBitmapData('black')], 20);

        this.playerDeath2 = this.game.add.emitter(this.player.x,  this.player.y,10);
        this.playerDeath2.setAlpha(0.2, 0.3, 800);
        this.playerDeath2.setXSpeed(-200, 200);
        this.playerDeath2.setYSpeed(-200, 200);
        this.playerDeath2.setRotation(50,-100);
        this.playerDeath2.setScale(6, 8, 6, 8, 1000, Phaser.Easing.Quintic.Out);
        this.playerDeath2.makeParticles(this.game.cache.getBitmapData('black'), 10);

        this.jumpTrail = this.game.add.emitter(0, 20,20);
        this.jumpTrail.setScale(2, 4, 2, 4, 800, Phaser.Easing.Quintic.Out);
        this.jumpTrail.setAlpha(0.01, 0.5);
        this.jumpTrail.setXSpeed(-20, 20);
        this.jumpTrail.setYSpeed(10, 800);
        this.jumpTrail.makeParticles([this.game.cache.getBitmapData('yellow'),this.game.cache.getBitmapData('red')],20);
        this.player.addChild(this.jumpTrail);
    },
     
    createScore: function() {
        this.scoreText = this.game.add.bitmapText(0, 0,'font', '0',200);
        this.scoreText.anchor.set(0.5);
        this.scoreText.x = this.game.width*0.5;
        this.scoreText.y = this.game.height*0.5;
        this.scoreText.alpha = 0.3;
        this.scoreText.fixedToCamera = true;
    },

    engineOn: function(){
          if(isJumping || this.gameOver) return;

          isJumping = true;
          this.isPowerUp = false;
          this.jumpTrail.flow(200, 250, 20, 20,false);
          this.acceleratePlayer(config.normalJump,800);
     },

     engineOff: function(){
          isJumping = false;
          this.player.body.velocity.y = 0;
          this.player.body.velocity.x = 0;
          this.player.shield = false;
     },

     acceleratePlayer: function(power,duration){
          this.player.body.velocity.x = Math.cos(this.player.rotation  - (Math.PI / 2)) * power;
          this.player.body.velocity.y = Math.sin(this.player.rotation  - (Math.PI / 2)) * power;
          this.game.time.events.add(duration,this.engineOff,this);
     },

     activatePower: function(player, item){
          isJumping = true;
          this.game.time.events.removeAll();
          item.kill();
          this.player.angle = 0;
          this.player.shield = true;
          this.specialPower.emitX = this.player.x;
          this.specialPower.emitY = this.player.y-this.game.height;
          this.jumpTrail.flow(200, 250, 20, 20,false);
          this.specialPower.flow(800, 250, 150, 150,false);
          this.acceleratePlayer(config.specialJump,1000);
     },

    update: function(){ 
        if(!this.isStart) return;

        this.shipTrail.emitX = this.player.x;
        this.shipTrail.emitY = this.player.y + 25;
        this.fireEngine.emitX = this.player.x;
        this.fireEngine.emitY = this.player.y + 20;

        score = Math.abs(parseInt(this.player.y/288)-2);
        this.scoreText.text = score;

        this.squareObstacles.forEach(function(square){
            square.angle += square.speed * (this.game.time.elapsed/1000);
            if(square.y > this.player.y + (this.game.height*0.5))
                square.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.4,this.player.y-this.game.height*0.3));
        },this);

        this.circleObstacles.forEach(function(circle){
            circle.angle += circle.speed * (this.game.time.elapsed/1000);
              if(circle.y > this.player.y + (this.game.height*0.5))
                circle.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.4,this.player.y-this.game.height*0.8));
        },this);

        this.items.forEach(function(item){
            item.y += item.speed * (this.game.time.elapsed/1000);
              if(item.y > this.player.y + (this.game.height*0.5))
                item.reset(this.game.rnd.between(this.player.x-this.game.width,this.player.x+this.game.width),this.game.rnd.between(this.player.y-this.game.height*0.4,this.player.y-this.game.height*0.3));
        },this);

        if(!this.player.shield)
          this.game.physics.arcade.collide(this.player, [this.ground,this.circleObstacles,this.squareObstacles], this.destroyPlayer, null, this);
        
        this.game.physics.arcade.collide(this.player, this.items, this.activatePower, null, this);

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