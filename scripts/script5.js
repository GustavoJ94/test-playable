
var game = new Phaser.Game({
	width: "100",
	height: "100",
	parent: "game-holder",
	renderer: Phaser.CANVAS,
	state: this
});

//GAME OPTIONS//
function preload() {
	//GAME OPTIONS//
	this.bgColor = "#000000"; //Background Color
	this.minWidth = 720;
	this.minHeight = 480;
	this.isRandom = true;
	this.answer = false;
	this.questionNumber = -4;
	this.textStyle = { font: "bold 60px Arial", fill: "#fff",align:"center",strokeThickness:8,stroke:"#000"};
	this.textStyle2 = { font: "bold 30px Arial", fill: "#fff",align:"center",strokeThickness:10,stroke:"#000"};
	///////////////
	game.stage.backgroundColor = this.bgColor;
	this.game.load.image('bg','assets2/bg.png');
	this.game.load.image('minus','assets2/minus.png');
	this.game.load.image('plus','assets2/plus.png');
	this.game.load.image('try','assets2/try.png');
    this.game.load.audio('btnSfx', 'assets2/click.ogg');
    this.game.load.audio('correct', 'assets2/correct.ogg');

	game.flexcale = game.plugins.add(Phaser.Plugin.Flexcale);
	game.flexcale.setOptions({
		minWidth: this.minWidth,
		minHeight: this.minHeight,
		resolution: 1,
	});
}

function youWin(btn){
	this.sfxWin.play();
	this.doneText = game.add.text(0, this.text.y, "Correct", this.textStyle2);
	this.doneText.anchor.set(0.5);
    this.doneText.position.x = this.text.width*0.5+(this.doneText.width*0.7);
    this.doneText.position.y += this.doneText.height*1.5; 
    this.graphics.addChild(this.doneText);

    this.game.add.tween(btn).to({x:this.doneText.x,y:this.doneText.y+this.doneText.height*4}, 500, Phaser.Easing.Linear.None,true);
	this.emitter2.x = btn.x;
    this.emitter2.y = btn.y;
	this.emitter2.start(true, 800, null, 10);

}

function youLose(btn){
	this.doneText = game.add.text(0,  this.text.y, "Try Again", this.textStyle2);
	this.doneText.anchor.set(0.5);
    this.doneText.position.x = this.text.width*0.5+(this.doneText.width*0.5);
    this.doneText.position.y += this.doneText.height*1.5; 

    this.tryBtn = game.add.sprite(0, 0, 'try');
    this.tryBtn.anchor.set(0.5);
    this.tryBtn.position.x = this.text.width*0.5+(this.tryBtn.width*1.55);
    this.tryBtn.position.y = this.text.y+this.text.height*7; 
    this.tryBtn.inputEnabled = true;
    this.tryBtn.events.onInputDown.add(create, this);
    this.graphics.addChild(this.doneText);
    this.graphics.addChild(this.tryBtn);

    this.game.add.tween(btn).to({x:this.doneText.x,y:this.doneText.y+this.doneText.height*4}, 500, Phaser.Easing.Linear.None,true);
	this.emitter2.x = btn.x;
    this.emitter2.y = btn.y;
	this.emitter2.start(true, 800, null, 10);
}

function buttonDown(btn){
	this.sfx.play();
	this.selected = btn.status;

	if(this.selected){
		this.emitter2.makeParticles('plus',4);
		this.minus.kill();
	}
	else{
		this.emitter2.makeParticles('minus',4);
		this.plus.kill();
	}
    
	if(this.selected == this.answer)
		youWin(btn);
	else
		youLose(btn);
}

function create() {
	this.sfx = game.add.audio('btnSfx',0.1);
	this.sfxWin = game.add.audio('correct',0.5);

	this.graphics = game.add.sprite(0, 0, 'bg');
    /////////////////////////////
    this.text = game.add.text(0, 0, "Is this a negative or positive number?", this.textStyle2);
 	this.text.anchor.set(0.5);
    this.text.position.x += this.graphics.width*0.5;
    this.text.position.y += this.text.height*1.5;

    this.numberMid = game.add.text(0, 0, this.questionNumber, this.textStyle);
 	this.numberMid.anchor.set(0.5);
    this.numberMid.position.x += this.graphics.width*0.5;
    this.numberMid.position.y += this.graphics.height*0.5;

	var text1 = game.add.text(0, 0, "POSITIVE", this.textStyle2);
	text1.anchor.set(0.5);
    this.plus = game.add.sprite(this.numberMid.x, this.numberMid.y, 'plus');
 	this.plus.anchor.set(0.5);
    this.plus.position.x -= this.plus.width;
    this.plus.position.y += this.plus.height*2;
    this.plus.status = true;
 	this.plus.addChild(text1);
 	this.plus.inputEnabled = true;
    this.plus.events.onInputDown.add(buttonDown, this);

	var text2 = game.add.text(0, 0, "NEGATIVE", this.textStyle2);
	text2.anchor.set(0.5);
    this.minus = game.add.sprite(this.numberMid.x, this.numberMid.y, 'minus');
 	this.minus.anchor.set(0.5);
    this.minus.position.x += this.minus.width;
    this.minus.position.y += this.minus.height*2;
    this.minus.status = false;
    this.minus.addChild(text2);
    this.minus.inputEnabled = true;
    this.minus.events.onInputDown.add(buttonDown, this);

    this.emitter2 = this.game.add.emitter(0, 0, 100);
    this.emitter2.minParticleScale = 0.05;
    this.emitter2.maxParticleScale = 0.05;
    ////////////////////////////////

	this.graphics.addChild(this.text);
	this.graphics.addChild(this.numberMid);
	this.graphics.addChild(this.plus);
	this.graphics.addChild(this.minus);
	this.graphics.addChild(this.emitter2);

	game.flexcale.onResize.add(function (scale) {
		this.graphics.scale.setTo(scale);
		this.graphics.alignIn(game.world, Phaser.CENTER);
	});

	game.flexcale.resize();
}
