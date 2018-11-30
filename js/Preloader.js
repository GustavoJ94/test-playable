
var boomRocket = {};
var hueValue = 0;
var score = 0;
var rotationSpeed = config.rotationSpeed;
var isJumping = true;

WebFontConfig = {
    google: {
      families: ['Noto Sans']
    }
}

boomRocket.Preloader = function(game) {
    this.game = game;
};

boomRocket.Preloader.prototype = {
    
    preload: function() {
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image('arrow','assets/arrow.png');
        this.load.image('circle','assets/Circle.png');
        this.load.image('rocket','assets/Rocket.png');
        this.load.image('square','assets/Square.png');  
        this.load.image('spike','assets/spike.png');  
        this.load.spritesheet('item','assets/item.png',32,32);      
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

        var white = this.game.add.bitmapData(4, 4);
        white.ctx.fillStyle = 'white';
        white.ctx.rect(0,0,4,4);
        white.ctx.fill();
        this.game.cache.addBitmapData('white', white);

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