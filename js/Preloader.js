
var boomRocket = {};
var score = 0;
var hueValue = 0;
var rotationSpeed = config.rotationSpeed;
var isJumping = true;

boomRocket.Preloader = function(game) {
    this.game = game;
};

boomRocket.Preloader.prototype = {
    
    preload: function() {
        this.load.image('arrow','assets/arrow.png');
        this.load.image('circle','assets/Circle.png');
        this.load.image('rocket','assets/Rocket.png');
        this.load.image('square','assets/Square.png');
    },

    create: function() {

        this.game.flexcale = this.game.plugins.add(Phaser.Plugin.Flexcale);
        this.game.flexcale.setOptions({
            minWidth: config.minWidth,
            minHeight: config.minHeight,
            resolution: 1,
        });
    },

    loadUpdate: function() {
        playsiveSDK.loadingProgressUpdate(this.load.progress);
    },

    update: function() {
        this.state.start('Game');
    }
};