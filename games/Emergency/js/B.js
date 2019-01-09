var Bacteria = {};
var player;
var idioma;
var lenguaje = null;
var niveles = {};
var musica;
var score = 0;
var bscore = 0;
var isGame = false;
var timeStarted = false;
var timeLeft = 29100;
var domainHex = "6e696e6a616269747367616d65732e636f6d";
var domainHex2 = "7777772e6e696e6a616269747367616d65732e636f6d";
var domainHex3 = "687474703a2f2f6e696e6a616269747367616d65732e636f6d";
Bacteria.Boot = function(game) {};
Bacteria.Boot.prototype = {
    init: function() {
        var lastscore = JSON.parse(window.localStorage.getItem('bscore'));
        if (lastscore) {
            bscore = lastscore
        }
        idioma = navigator.language || navigator.userLanguage;
        idioma = idioma.substring(0, 2);
        this.input.maxPointers = 1;
        this.game.input.addPointer();
    
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true
        
    },
    preload: function() {
        this.load.image('loadbg', 'assets/load.png');
        this.load.image('preloaderBar', 'assets/loading-bar.png');
        this.load.image('tituloEN', 'assets/emergencyEN.png');
        this.load.bitmapFont('font', 'assets/font.png', 'assets/font.fnt')
    },
    create: function() {
        //var domainStr = this.hexToString(domainHex);
       // var domainStr2 = this.hexToString(domainHex2);
       // var domainStr3 = this.hexToString(domainHex3);
        this.game.tweens.frameBased = true;
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        this.game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 1.5,
            ease: Phaser.Easing.Exponential.Out,
            properties: {
                alpha: 0
            }
        });
       // if (window.top.location.hostname != domainStr2) {
         //   parent.location = (domainStr3)
        //}
       // if (window.location.hostname == domainStr2 || window.location.hostname == domainStr) {
            this.state.start('Preloader')
        //}
    },
    hexToString: function(hex) {
        var str = '';
        var hexLen = hex.length;
        for (var i = 0; i < hexLen; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
        }
        return str
    }
};