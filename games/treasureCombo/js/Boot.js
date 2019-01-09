var Treasure = {};
var timeStarted = false;
var timeLeft = 22700;
var lastTime = 500;
var timeBar;
var speed = 15;
var player;
var english = {};
var spanish = {};
var frances = {};
var portugues = {};
var italiano = {};
var idioma;
var lenguaje = null;
var niveles = {};
var musica;
var domainHex = "6e696e6a616269747367616d65732e636f6d";
var domainHex2 = "7777772e6e696e6a616269747367616d65732e636f6d";
var global = {
    thumbRows: 6,
    thumbCols: 5,
    thumbWidth: 64,
    thumbHeight: 64,
    thumbSpacing: 12,
    starsArray: [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    level: 0
};
Treasure.Boot = function(game) {};
Treasure.Boot.prototype = {
    init: function() {
        niveles[1] = {
            tipo: 0,
            speed: 10,
            objetivo: 3000,
            tiempo: 0
        };
        niveles[2] = {
            tipo: 1,
            speed: 7,
            objetivo: 20,
            tiempo: 0
        };
        niveles[3] = {
            tipo: 0,
            speed: 14,
            objetivo: 9000,
            tiempo: 0
        };
        niveles[4] = {
            tipo: 0,
            speed: 15,
            objetivo: 12000,
            tiempo: 0
        };
        niveles[5] = {
            tipo: 2,
            speed: 10,
            objetivo: 10,
            tiempo: 0
        };
        niveles[6] = {
            tipo: 0,
            speed: 12,
            objetivo: 6000,
            tiempo: 0
        };
        niveles[7] = {
            tipo: 1,
            speed: 10,
            objetivo: 40,
            tiempo: 0
        };
        niveles[8] = {
            tipo: 1,
            speed: 11,
            objetivo: 60,
            tiempo: 0
        };
        niveles[9] = {
            tipo: 1,
            speed: 7,
            objetivo: 50,
            tiempo: 0
        };
        niveles[10] = {
            tipo: 1,
            speed: 14,
            objetivo: 60,
            tiempo: 0
        };
        niveles[11] = {
            tipo: 0,
            speed: 20,
            objetivo: 15000,
            tiempo: 0
        };
        niveles[12] = {
            tipo: 2,
            speed: 17,
            objetivo: 20,
            tiempo: 0
        };
        niveles[13] = {
            tipo: 2,
            speed: 19,
            objetivo: 30,
            tiempo: 0
        };
        niveles[14] = {
            tipo: 2,
            speed: 20,
            objetivo: 40,
            tiempo: 0
        };
        niveles[15] = {
            tipo: 2,
            speed: 24,
            objetivo: 50,
            tiempo: 0
        };
        niveles[16] = {
            tipo: 0,
            speed: 10,
            objetivo: 4000,
            tiempo: 200
        };
        niveles[17] = {
            tipo: 0,
            speed: 12,
            objetivo: 8000,
            tiempo: 150
        };
        niveles[18] = {
            tipo: 0,
            speed: 14,
            objetivo: 9000,
            tiempo: 120
        };
        niveles[19] = {
            tipo: 0,
            speed: 15,
            objetivo: 11000,
            tiempo: 80
        };
        niveles[20] = {
            tipo: 0,
            speed: 20,
            objetivo: 8500,
            tiempo: 60
        };
        niveles[21] = {
            tipo: 3,
            speed: 25,
            objetivo: 2000,
            tiempo: 0
        };
        niveles[22] = {
            tipo: 3,
            speed: 20,
            objetivo: 4000,
            tiempo: 0
        };
        niveles[23] = {
            tipo: 3,
            speed: 15,
            objetivo: 6000,
            tiempo: 0
        };
        niveles[24] = {
            tipo: 3,
            speed: 20,
            objetivo: 5000,
            tiempo: 0
        };
        niveles[25] = {
            tipo: 3,
            speed: 30,
            objetivo: 5000,
            tiempo: 0
        };
        niveles[26] = {
            tipo: 2,
            speed: 20,
            objetivo: 40,
            tiempo: 0
        };
        niveles[27] = {
            tipo: 3,
            speed: 45,
            objetivo: 1000,
            tiempo: 100
        };
        niveles[28] = {
            tipo: 1,
            speed: 25,
            objetivo: 10,
            tiempo: 0
        };
        niveles[29] = {
            tipo: 0,
            speed: 30,
            objetivo: 5000,
            tiempo: 40
        };
        niveles[30] = {
            tipo: 1,
            speed: 13,
            objetivo: 60,
            tiempo: 0
        };
        niveles[31] = {
            tipo: 2,
            speed: 20,
            objetivo: 20,
            tiempo: 0
        };
        niveles[32] = {
            tipo: 0,
            speed: 18,
            objetivo: 6000,
            tiempo: 100
        };
        niveles[33] = {
            tipo: 1,
            speed: 12,
            objetivo: 35,
            tiempo: 0
        };
        niveles[34] = {
            tipo: 0,
            speed: 15,
            objetivo: 12000,
            tiempo: 90
        };
        niveles[35] = {
            tipo: 0,
            speed: 20,
            objetivo: 15000,
            tiempo: 120
        };
        niveles[36] = {
            tipo: 1,
            speed: 20,
            objetivo: 20,
            tiempo: 0
        };
        niveles[37] = {
            tipo: 1,
            speed: 10,
            objetivo: 50,
            tiempo: 0
        };
        niveles[38] = {
            tipo: 3,
            speed: 12,
            objetivo: 7000,
            tiempo: 0
        };
        niveles[39] = {
            tipo: 3,
            speed: 15,
            objetivo: 8500,
            tiempo: 250
        };
        niveles[40] = {
            tipo: 0,
            speed: 20,
            objetivo: 15000,
            tiempo: 0
        };
        niveles[41] = {
            tipo: 0,
            speed: 10,
            objetivo: 12000,
            tiempo: 200
        };
        niveles[42] = {
            tipo: 2,
            speed: 20,
            objetivo: 15,
            tiempo: 0
        };
        niveles[43] = {
            tipo: 2,
            speed: 25,
            objetivo: 10,
            tiempo: 0
        };
        niveles[44] = {
            tipo: 1,
            speed: 30,
            objetivo: 10,
            tiempo: 0
        };
        niveles[45] = {
            tipo: 1,
            speed: 15,
            objetivo: 35,
            tiempo: 0
        };
        niveles[46] = {
            tipo: 3,
            speed: 20,
            objetivo: 4000,
            tiempo: 80
        };
        niveles[47] = {
            tipo: 3,
            speed: 25,
            objetivo: 5500,
            tiempo: 150
        };
        niveles[48] = {
            tipo: 0,
            speed: 14,
            objetivo: 14000,
            tiempo: 120
        };
        niveles[49] = {
            tipo: 1,
            speed: 11,
            objetivo: 50,
            tiempo: 0
        };
        niveles[50] = {
            tipo: 3,
            speed: 20,
            objetivo: 3000,
            tiempo: 60
        };
        niveles[51] = {
            tipo: 2,
            speed: 25,
            objetivo: 15,
            tiempo: 0
        };
        niveles[52] = {
            tipo: 0,
            speed: 15,
            objetivo: 30000,
            tiempo: 0
        };
        niveles[53] = {
            tipo: 0,
            speed: 20,
            objetivo: 15000,
            tiempo: 150
        };
        niveles[54] = {
            tipo: 1,
            speed: 20,
            objetivo: 20,
            tiempo: 0
        };
        niveles[55] = {
            tipo: 3,
            speed: 20,
            objetivo: 8000,
            tiempo: 0
        };
        niveles[56] = {
            tipo: 2,
            speed: 20,
            objetivo: 40,
            tiempo: 0
        };
        niveles[57] = {
            tipo: 0,
            speed: 25,
            objetivo: 12000,
            tiempo: 80
        };
        niveles[58] = {
            tipo: 1,
            speed: 13,
            objetivo: 30,
            tiempo: 0
        };
        niveles[59] = {
            tipo: 3,
            speed: 30,
            objetivo: 3600,
            tiempo: 70
        };
        niveles[60] = {
            tipo: 0,
            speed: 15,
            objetivo: 10500,
            tiempo: 80
        };
        english['survive'] = 'SURVIVED WITH';
        english['level'] = 'SELECT A LEVEL';
        english['goal'] = 'GOAL\n';
        english['complete'] = 'LEVEL COMPLETE';
        english['lavamode'] = 'FINISH LEVEL 20\nTO UNLOCK';
        english['goldmode'] = 'FINISH LEVEL 40\nTO UNLOCK';
        english['ayuda1'] = 'USE THE BUTTONS ABOVE\nTO RETURN OR PAUSE THE GAME';
        english['ayuda2'] = 'THERE ARE SEVERAL GAME\nMODES AT DIFFERENT LEVELS\nWHICH ARE:\nTREASURE MODE\n\nLAVA MODE\n\nGOLD MODE\n\nTIME TRIAL MODE\n\nMODE ICE';
        english['ayuda3'] = 'EXCEED THE OBJECTIVE BY\nCOMBINING MATCHING GEMS';
        english['ayuda4'] = 'DO NOT TOUCH THE GEMS\nWITH TEAR DROP SHAPE\nTHESE WILL MAKE THE\n LAVA STOPS';
        english['ayuda5'] = 'TOUCH THE GOLDEN GEMS\nTO PUT THEM IN THE WAGON.\nBE CAREFUL WITH THE DYNAMITE';
        english['ayuda6'] = 'AT TIMES THERE WILL BE\nA TIMER.\nCOMPLETE THE OBJECTIVE\nBEFORE IT RUNS OUT.';
        english['ayuda7'] = 'THE GEMS CHANGED IN \nOCCASIONS AND THE ICE SPIKES\nWILL INTERRUPT THE GAME.';
        spanish['survive'] = 'SOBREVIVISTE CON';
        spanish['level'] = 'ELIJA UN NIVEL';
        spanish['goal'] = 'META\n';
        spanish['complete'] = 'NIVEL COMPLETADO';
        spanish['lavamode'] = 'SUPERA EL NIVEL 20\nPARA DESBLOQUEAR';
        spanish['goldmode'] = 'SUPERA EL NIVEL 40\nPARA DESBLOQUEAR';
        spanish['ayuda1'] = 'USA LOS BOTONES SUPERIORES\nPARA REGRESAR O PAUSAR';
        spanish['ayuda2'] = 'HAY VARIOS MODOS DE JUEGO\nEN LOS DISTINTOS NIVELES\nESTOS SON:\n\nMODO TREASURE\nMODO LAVA\nMODO GOLD\nMODO CONTRARELOJ\nMODO ICE';
        spanish['ayuda3'] = 'SUPERE EL OBJETIVO\nCOMBINANDO GEMAS IGUALES';
        spanish['ayuda4'] = 'NO TOQUES LAS GEMAS\nEN FORMA DE AGUA.\nESTAN HARAN QUE LA\nLAVA SE DETENGA';
        spanish['ayuda5'] = 'TOCA LAS GEMAS DORADAS\nPARA COLOCARLAS EN EL\nVAGON.\nTEN CUIDADO CON LA DINAMITA';
        spanish['ayuda6'] = 'A VECES HABRA UN RELOJ.\nCOMPLETA EL OBJETIVO ANTES\nDE QUE SE ACABE EL TIEMPO';
        spanish['ayuda7'] = 'LAS GEMAS CAMBIAN EN\nOCASIONES.\nY LAS PUAS DE HIELO TE\nDETENDRAN.';
        var nivelesUnlock = JSON.parse(window.localStorage.getItem('niveles'));
        if (nivelesUnlock) {
            global.starsArray = nivelesUnlock
        }
        idioma = navigator.language || navigator.userLanguage;
        idioma = idioma.substring(0, 2);
        lenguaje = english;
        if (idioma == 'en') lenguaje = english;
        else if (idioma == 'es') lenguaje = spanish;
        this.input.maxPointers = 2;
        this.game.input.addPointer();
        this.game.input.addPointer();

            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true
      
    },
    preload: function() {
        this.load.image('load', 'assets/load.png');
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
                height: this.game.height * 3,
                width: this.game.width * 3
            }
        });
        //if (window.location.hostname == domainStr2 || window.location.hostname == domainStr) {
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