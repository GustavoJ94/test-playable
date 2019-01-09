var futbol = {};
var colores = [0xFDC1A9, 0xF5AE90, 0xE69A7A, 0x854E39, 0xBE2633, 0xE06F8B, 0x493C2B, 0xA46422, 0xEB8931, 0xF7E26B, 0x44891A, 0xA3CE27, 0x1B2632, 0x005784, 0x31A2F2, 0xB2DCEF];
var cabellosPosY = [124, 136, 136, 146, 141, 154, 162, 156, 156];
var cabellosPosX = [98, 91, 84, 84, 84, 82, 84, 82, 82];
var player;
var idioma;
var lenguaje;
var isGame;
var socket;
var domainHex = "6e696e6a616269747367616d65732e636f6d";
var domainHex2 = "7777772e6e696e6a616269747367616d65732e636f6d";
var domainHex3 = "687474703a2f2f6e696e6a616269747367616d65732e636f6d";
futbol.Boot = function(game) {};
futbol.Boot.prototype = {
    init: function() {
        var jugadorConf = JSON.parse(window.localStorage.getItem('jug'));
        if (jugadorConf) {
            player = jugadorConf
        }
        idioma = navigator.language || navigator.userLanguage;
        idioma = idioma.substring(0, 2);
        lenguaje = english;
        if (idioma == 'en') lenguaje = english;
        else if (idioma == 'es') lenguaje = spanish;
        else if (idioma == 'fr') lenguaje = french;
        this.game.camera.roundPx = false;
        this.game.advancedTiming = true;
        this.input.maxPointers = 1;
        this.game.input.addPointer();
    
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true
       
    },
    preload: function() {
        this.load.image('preloaderBar', 'assets/loading-bar.png');
        this.load.image('load', 'assets/load.png');
        this.load.bitmapFont('font2', 'assets/font2.png', 'assets/font2.fnt')
    },
    create: function() {
        var domainStr = this.hexToString(domainHex);
        var domainStr2 = this.hexToString(domainHex2);
        var domainStr3 = this.hexToString(domainHex3);
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        this.game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 1.5,
            ease: Phaser.Easing.Exponential.Out,
            properties: {
                alpha: 0
            }
        });
       // if (window.top.location.hostname != domainStr2) {
       //     parent.location = (domainStr3)
       // }
        //if (window.location.hostname == domainStr2 || window.location.hostname == domainStr) {
            this.state.start('Preloader')
       // }
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