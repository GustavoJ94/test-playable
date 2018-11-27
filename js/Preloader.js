
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
        var fireSmoke = this.game.add.bitmapData(3, 3);
        fireSmoke.ctx.fillStyle = 'rgba(255,211,0,1)';
        fireSmoke.ctx.rect(0,0,3,3);
        fireSmoke.ctx.fill();
        this.game.cache.addBitmapData('yellow', fireSmoke);

        var smoke = this.game.add.bitmapData(4, 4);
        smoke.ctx.rect(0,0,4,4);
        smoke.ctx.fill();
        this.game.cache.addBitmapData('black', smoke);

        var redSmoke = this.game.add.bitmapData(3, 3);
        redSmoke.ctx.rect(0,0,4,4);
        redSmoke.ctx.fillStyle = 'red';
        redSmoke.ctx.fill();
        this.game.cache.addBitmapData('red', redSmoke);

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