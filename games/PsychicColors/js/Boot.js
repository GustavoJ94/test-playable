var Psychic = {};
var score = 0;
var maximaScore = 0;
var level = 0;
var player;
var grupoCampos;
var isGame = true;
var bloques = ['verde', 'amarillo', 'azul', 'rojo'];
var fields = ['fieldAzul', 'fieldVerde', 'fieldAmarillo', 'fieldRojo'];
var timeStarted = false;
var timeBar;
var timeLeft = 15000;
var lastTime = 1000;
var textScore;
var textMaximaScore;
var english = {};
var spanish = {};
var frances = {};
var portugues = {};
var aleman = {};
var italiano = {};
var idioma;
var lenguaje = null;
var speed = 15;
var checkAzul = false;
var checkVerde = false;
var checkAmarillo = false;
var checkRojo = false;
var domainHex = "6e696e6a616269747367616d65732e636f6d";
var domainHex2 = "7777772e6e696e6a616269747367616d65732e636f6d";
Psychic.Boot = function(game) {};
Psychic.Boot.prototype = {
    init: function() {
        english['ayuda'] = 'move the blocks of colors to\nits corresponding place, don\'t\nlet the red bar runs out';
        spanish['ayuda'] = 'mueva los bloques de colores\na su lugar correspondiente, no\ndejes que la barra roja se\nagote.';
        frances['ayuda'] = 'déplacez les blocs de couleurs\nà son lieu correspondant, ne\nlaissez pas la barre rouge\nest épuisée.';
        portugues['ayuda'] = 'mova os blocos de cores para\nseu lugar correspondente, não\ndeixe que a barra vermelha\né esgote.';
        aleman['ayuda'] = 'bewege die blöcke der farben\nzu seinem entsprechenden ort\nlassen sie sich nicht die rote\nbar abläuft.';
        italiano['ayuda'] = 'spostare i blocchi di colori\nper il suo luogo corrispondente\nnon lasciate che la barra rossa\nsi esaurisce.';
        idioma = navigator.language || navigator.userLanguage;
        idioma = idioma.substring(0, 2);
        lenguaje = english;
        if (idioma == 'en') lenguaje = english;
        else if (idioma == 'es') lenguaje = spanish;
        else if (idioma == 'fr') lenguaje = frances;
        else if (idioma == 'pt') lenguaje = portugues;
        else if (idioma == 'de') lenguaje = aleman;
        else if (idioma == 'it') lenguaje = italiano;
        var puntaje = window.localStorage.getItem('puntaje');
        if (puntaje) {
            maximaScore = puntaje
        }
        this.input.maxPointers = 2;
 
            this.game.input.addPointer();
            this.game.input.addPointer();
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true
     
    },
    preload: function() {
        this.load.image('preloaderBar', 'assets/loading-bar.png')
    },
    create: function() {
        var domainStr = this.hexToString(domainHex);
        var domainStr2 = this.hexToString(domainHex2);
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
        this.game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 1.5,
            ease: Phaser.Easing.Exponential.Out,
            properties: {
                alpha: 0,
                angle: 360
            }
        });
            this.state.start('Preloader')
        
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