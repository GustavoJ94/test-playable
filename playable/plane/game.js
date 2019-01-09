var gameOptions = {
 
    // bird gravity, will make bird fall if you don't flap
    birdGravity: 800,
 
    // horizontal bird speed
    birdSpeed: 125,
 
    // flap thrust
    birdFlapPower: 300,
 
    // minimum pipe height, in pixels. Affects hole position
    minPipeHeight: 50,
 
    // distance range from next pipe, in pixels
    pipeDistance: [220, 280],
 
    // hole range between pipes, in pixels
    pipeHole: [100, 130],
 
    // local storage object name
    localStorageName: "bestFlappyScore"
}
 
window.onload = function() {
    game = new Phaser.Game(320, 480, Phaser.CANVAS);
    game.state.add("Play", play, true);
}
 
var play = function(){}
play.prototype = {
    preload:function(){
        this.load.bitmapFont('font', 'font.png', 'font.xml');
        game.load.image("bg", "bg.png");
        game.load.image("bird", "ufo.png");
        game.load.image("play", "play.png");
        game.load.image("pipe", "pipe.png");
        game.load.image("playnow", "playnow.png");
    },
    create:function(){
        game.stage.backgroundColor = "#87CEEB";
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.score = 0;
        this.topScore =  0;
        this.gameStart = false;
        this.bg = game.add.sprite(this.game.width*0.5, this.game.height*0.5, "bg");
        this.bg.anchor.set(0.5);
        this.pipeGroup = game.add.group();

        this.cta = this.game.add.sprite(this.world.centerX, this.world.centerY, "playnow");
        this.cta.anchor.set(0.5);
        this.cta.inputEnabled = true;
        this.cta.visible = false;
        this.cta.y += this.cta.height*1.5;
        this.cta.events.onInputUp.add(this.onClickCTA,this);
        this.ctatween = this.game.add.tween(this.cta.scale).to({x:this.cta.scale.x*1.2, y:this.cta.scale.y*1.2}, 1000, Phaser.Easing.Quadratic.InOut,false,0,-1,true);

        this.play = this.game.add.sprite(this.world.centerX, this.world.centerY, "play");
        this.play.anchor.set(0.5);
        this.play.inputEnabled = true;
        this.play.events.onInputUp.add(this.onClickPlay,this);
        this.game.add.tween(this.play.scale).to({x:this.play.scale.x*1.2, y:this.play.scale.y*1.2}, 1000, Phaser.Easing.Quadratic.InOut,true,0,-1,true);

        this.scoreText = this.game.add.bitmapText(this.game.width*0.5, this.game.height*0.5,'font', '0',200);
        this.scoreText.anchor.set(0.5);
        this.scoreText.alpha = 0.0;
        this.scoreText.tint = 0x72545D;

        this.updateScore(0);
        this.bird = game.add.sprite(80, 240, "bird");
        this.bird.anchor.set(0.5);
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = gameOptions.birdGravity;
        this.bird.body.allowGravity =false;
        this.bird.body.setSize(28, 28);
        game.input.onDown.add(this.flap, this);
    },
    onClickCTA: function(){
        console.log("clicked cta");
    },
    onClickPlay:function(){
        this.bird.body.allowGravity =true;
        this.scoreText.alpha = 0.4;
        this.gameStart = true;
        this.play.kill();
        this.flap();
        var pipePosition = game.width
        do{
            this.addPipe(pipePosition);
            pipePosition += game.rnd.between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
        } while(pipePosition < game.width * 4);
    },
    update:function(){
        if(this.gameStart){
            game.physics.arcade.collide(this.bird, this.pipeGroup, this.die, null, this);
            if(this.bird.y > game.height || this.bird.y < 0){
                this.die();
            }
        }
    },
    updateScore: function(inc){
        this.score += inc;
        this.scoreText.text = "" + this.score;
    },
    flap: function(){
        if(this.gameStart)
        this.bird.body.velocity.y = -gameOptions.birdFlapPower;
    },
    die: function(){
        this.gameStart = false;
        this.pipeGroup.destroy();
        this.scoreText.alpha = 1;
        this.bird.kill();
        this.cta.visible = true;
        this.ctatween.start();
    },
    addPipe: function(posX){
        var pipeHoleHeight = game.rnd.between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);
        var pipeHolePosition = game.rnd.between(gameOptions.minPipeHeight + pipeHoleHeight / 2, game.height - gameOptions.minPipeHeight - pipeHoleHeight / 2);
        var upperPipe = new Pipe(game, posX, pipeHolePosition - pipeHoleHeight / 2, -gameOptions.birdSpeed);
        game.add.existing(upperPipe);
        upperPipe.anchor.set(0.5, 1);
        this.pipeGroup.add(upperPipe);
        var lowerPipe = new Pipe(game, posX, pipeHolePosition + pipeHoleHeight / 2, -gameOptions.birdSpeed);
        game.add.existing(lowerPipe);
        lowerPipe.anchor.set(0.5, 0);
        this.pipeGroup.add(lowerPipe);
    }
}
 
Pipe = function (game, x, y, speed) {
    Phaser.Sprite.call(this, game, x, y, "pipe");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.velocity.x = speed;
    this.body.immovable  = true;
    this.giveScore = true;
};
 
Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;
 
Pipe.prototype.update = function() {
    if(this.x + this.width < game.state.states[game.state.current].bird.x && this.giveScore){
        game.state.states[game.state.current].updateScore(0.5);
        this.giveScore = false;
    }
    if(this.x < -this.width){
        this.giveScore = true;
        game.state.states[game.state.current].pipeGroup.sort("x", Phaser.Group.SORT_DESCENDING);
        if(game.state.states[game.state.current].pipeGroup.getChildAt(0).x == game.state.states[game.state.current].pipeGroup.getChildAt(1).x){
            this.x = game.state.states[game.state.current].pipeGroup.getChildAt(0).x + game.rnd.between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
        }
        else{
            this.x = game.state.states[game.state.current].pipeGroup.getChildAt(0).x;
        }
    }
};