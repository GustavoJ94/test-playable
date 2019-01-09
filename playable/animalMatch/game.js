var game;
var gameOptions = {
    gameWidth: 480,
    gameHeight: 640,
    circleColors: [0,1,2,3],
    circlePositions: [new Phaser.Point(-64, -64), new Phaser.Point(64, -64), new Phaser.Point(64, 64), new Phaser.Point(-64, 64)]
}
var SWIPEUP = 0;
var SWIPEDOWN = 1;
var SWIPELEFT = 2;
var SWIPERIGHT = 3;
window.onload = function() {
    game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight,Phaser.CANVAS);
    game.state.add("PlayGame", playGame);
    game.state.start("PlayGame");
}
var playGame = function(game){}
playGame.prototype = {
    preload: function(){
        this.load.bitmapFont('font', 'font.png', 'font.xml');
        game.load.image("bg", "bg.png");
        game.load.image("bg2", "bg2.png");
        game.load.image("hand", "hand.png");
        game.load.image("playnow", "playnow.png");
        game.load.image("stars", "stars.png");
        game.load.spritesheet("animals", "animals.png",86,86);
    },
    create: function(){
    	game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
        this.speedPair = 1;
        this.gameStart = false;
        this.score = 0;
        this.bg = game.add.sprite(this.game.width*0.5,this.game.height*0.5, "bg2");
        this.bg.anchor.set(0.5);
        this.bg2 = game.add.sprite(this.game.width*0.5,this.game.height*0.5, "bg");
        this.bg2.anchor.set(0.5);

        this.hand = game.add.sprite(this.game.width*0.15,this.game.height*0.75, "hand");
        this.hand.anchor.set(0.5);
        this.game.add.tween(this.hand).to({y:this.hand.y -100}, 1000, Phaser.Easing.Quadratic.InOut,true,0,-1,true);

        this.stars = this.game.add.sprite(this.world.centerX, this.game.height*0.15, "stars");
        this.stars.anchor.set(0.5);
        this.stars.scale.set(0);
        this.starstween = this.game.add.tween(this.stars.scale).to({x:1, y:1}, 1000, Phaser.Easing.Quadratic.InOut,false);

        this.cta = this.game.add.sprite(this.world.centerX, this.world.centerY, "playnow");
        this.cta.anchor.set(0.5);
        this.cta.inputEnabled = true;
        this.cta.visible = false;
        this.cta.y += this.cta.height*1.5;
        this.cta.events.onInputUp.add(this.onClickCTA,this);
        this.ctatween = this.game.add.tween(this.cta.scale).to({x:this.cta.scale.x*1.4, y:this.cta.scale.y*1.4}, 1000, Phaser.Easing.Quadratic.InOut,false,0,-1,true);

        this.scoreText = this.game.add.bitmapText(this.game.width*0.5, this.game.height*0.35,'font', ''+this.score,200);
        this.scoreText.anchor.set(0.5);
        this.scoreText.alpha = 0.3;
        this.scoreTexttween = this.game.add.tween(this.scoreText).to({y:this.scoreText.y +50}, 500, Phaser.Easing.Quadratic.InOut,false);

         this.swipeLeft = this.game.add.text(10, (game.height*0.8), "Swipe up/down", {
            font:"bold 16px Arial",  fill: "#ffffff"
        });

 		this.swipeRight = this.game.add.text(340, (game.height*0.8), "Swipe up/down", {
            font:"bold 16px Arial",  fill: "#ffffff"
        });

        this.doubleTap = this.game.add.text((game.width*0.5), (game.height*0.55), "Double tap to change icons", {
            font:"bold 16px Arial",  fill: "#ffffff"
        });
        this.doubleTap.anchor.set(0.5)

        this.circleGroup = game.add.group();
        this.pairGroup = game.add.group();
        this.pairGroup.x = (game.width*0.5);
        this.pairGroup.y = 0;

        this.circleGroup.x = (game.width*0.5);
        this.circleGroup.y = (game.height*0.75);
        this.circlesArray = [];
        for(var i = 0; i < 4; i++){
            var circle = game.add.sprite(gameOptions.circlePositions[i].x, gameOptions.circlePositions[i].y, "animals");
            circle.anchor.set(0.5);
            circle.frame = gameOptions.circleColors[i];
            this.circlesArray.push(circle);
            this.circleGroup.add(circle);
        }

        this.createPairs();
        game.input.onTap.add(this.handleTap, this);
        game.input.onDown.add(this.beginSwipe, this);
    },

    onClickCTA:function(){

    },

     updateScore: function(inc){
        this.score += inc;
        this.scoreText.text = "" + this.score;
        if(this.score >= 3){
            this.game.input.onTap.removeAll();
            this.gameStart = false;
            this.cta.visible = true;
            this.ctatween.start();
            this.starstween.start();
            this.scoreTexttween.start();
            this.cta.bringToTop();
        }
    },

    createPairs: function(){
    	var cNumber = [0, 1, 2, 3];
		this.colors = [];
		this.colorsChoose = [];
		Phaser.ArrayUtils.shuffle(cNumber);
		
		for(var i = 0;i < 3; i++) 
			this.colors.push(cNumber[i]);

    	var circle = game.add.sprite(gameOptions.circlePositions[0].x, gameOptions.circlePositions[0].y, "animals");
            circle.scale.set(0.5);
            circle.anchor.set(0.5);
        var circle2 = game.add.sprite(gameOptions.circlePositions[1].x, gameOptions.circlePositions[1].y, "animals");
            circle2.scale.set(0.5);
            circle2.anchor.set(0.5);
        circle.frame = gameOptions.circleColors[this.colors[0]];
        circle2.frame = gameOptions.circleColors[this.colors[1]];
        this.pairGroup.add(circle);
        this.pairGroup.add(circle2);
    },

    update: function(){
        if(this.gameStart){
    	this.pairGroup.y += this.speedPair;
        	if(this.pairGroup.y > (game.height*0.63)){
        		if(this.circlesArray[0].frame == this.pairGroup.children[0].frame && this.circlesArray[1].frame == this.pairGroup.children[1].frame){
        			this.pairGroup.y = 0;
    	    		this.speedPair = 1;
        			this.pairGroup.removeAll();
    	    		this.createPairs();
        			this.updateScore(1);
        		}
        		else{
    	    		this.speedPair = 1;
    	    		this.pairGroup.y = 0;
    	    		this.score = 0;
    	    		this.pairGroup.removeAll();
    	    		this.createPairs();
    	    		this.updateScore(0);
        		}
        	}
        }
    },

    handleTap: function(pointer, doubleTap){
        this.gameStart = true;
        this.hand.kill();

    	if(pointer.y < game.height*0.5)
    		this.speedPair = 8;

        if(doubleTap){
            var tweenRight = game.add.tween(this.circlesArray[0]).to({
                x: this.circlesArray[0].x + 128 
            }, 200, Phaser.Easing.Cubic.Out, true);
            var tweenLeft = game.add.tween(this.circlesArray[1]).to({
                x: this.circlesArray[1].x - 128 
            }, 200, Phaser.Easing.Cubic.Out, true);
            var tempSprite = this.circlesArray[0];
            this.circlesArray[0] = this.circlesArray[1];
            this.circlesArray[1] = tempSprite;
        }
    },
    beginSwipe: function(e) {
        game.input.onDown.remove(this.beginSwipe, this);
        game.input.onUp.add(this.endSwipe, this);
    },
    endSwipe: function(e) {
        game.input.onUp.remove(this.endSwipe, this);
        var swipeTime = e.timeUp - e.timeDown;
        var swipeDistance = Phaser.Point.subtract(e.position, e.positionDown);
        var swipeMagnitude = swipeDistance.getMagnitude();
        var swipeNormal = Phaser.Point.normalize(swipeDistance);
        if(swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if(swipeNormal.x > 0.8) {
                this.handleSwipe(SWIPERIGHT, e.position);
            }
            if(swipeNormal.x < -0.8) {
                this.handleSwipe(SWIPELEFT, e.position);
            }
            if(swipeNormal.y > 0.8) {
                this.handleSwipe(SWIPEDOWN, e.position);
            }
            if(swipeNormal.y < -0.8) {
                this.handleSwipe(SWIPEUP, e.position);
            }
        } else {
            game.input.onDown.add(this.beginSwipe, this);
        }
    },
    handleSwipe: function(dir, startPoint) {
        var degrees = ((dir == SWIPERIGHT) || (dir == SWIPEUP && startPoint.x < game.width / 2) || (dir == SWIPEDOWN && startPoint.x > game.width / 2)) ? 90 : -90;
        var rotateTween = game.add.tween(this.circleGroup).to({
            angle: degrees
        }, 300, Phaser.Easing.Cubic.Out, true);
        rotateTween.onComplete.add(function(){
            if(degrees == 90){
                Phaser.ArrayUtils.rotateRight(this.circlesArray);    
            }
            else{
                Phaser.ArrayUtils.rotateLeft(this.circlesArray);             
            }
            this.circleGroup.angle = 0;
            for(var i = 0; i < 4; i++){
                this.circlesArray[i].position.set(gameOptions.circlePositions[i].x, gameOptions.circlePositions[i].y);
            }                
        }, this);
        game.input.onDown.add(this.beginSwipe, this);
    }
}