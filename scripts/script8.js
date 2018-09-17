
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
	this.answer = '1000 less';
	this.textStyle = { font: "bold 60px Arial", fill: "#fff",align:"center",strokeThickness:8,stroke:"#000"};
	this.textStyle2 = { font: "bold 30px Arial", fill: "#fff",align:"center",strokeThickness:10,stroke:"#000"};
	///////////////
	game.stage.backgroundColor = this.bgColor;
	this.game.load.image('bg','assets3/bg.png');
	this.game.load.image('button','assets3/button.png');
	this.game.load.image('penguin','assets3/penguin.png');
	this.game.load.image('try','assets3/try.png');
    this.game.load.audio('btnSfx', 'assets3/click.ogg');
    this.game.load.audio('correct', 'assets3/correct.ogg');

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
    this.doneText.position.x = this.text.width*0.5+(this.doneText.width*1.5);
    this.doneText.position.y += this.doneText.height*3; 
    this.penguin = game.add.sprite(50, this.doneText.y+this.doneText.height*3, 'penguin');
    this.penguin.anchor.set(0.5);

    this.graphics.addChild(this.doneText);
    this.graphics.addChild(this.penguin);
   	this.game.add.tween(btn).to({x:this.doneText.x,y:this.doneText.y+this.doneText.height*1.5}, 500, Phaser.Easing.Linear.None,true);
   	this.t = this.game.add.tween(this.penguin).to({x:this.penguin.x+this.graphics.width}, 2000, Phaser.Easing.Linear.None,true);
   	this.t.onComplete.add(function(){this.penguin.kill();}.bind(this));
}

function youLose(btn){
	this.doneText = game.add.text(0,  this.text.y, "Try Again", this.textStyle2);
	this.doneText.anchor.set(0.5);
    this.doneText.position.x = this.text.width*0.5+(this.doneText.width*1.2);
    this.doneText.position.y += this.doneText.height*3; 

    this.tryBtn = game.add.sprite(0, 0, 'try');
    this.tryBtn.anchor.set(0.5);
    this.tryBtn.position.x = this.text.width*0.5+(this.tryBtn.width*3.5);
    this.tryBtn.position.y = this.text.y+this.text.height*6; 
    this.tryBtn.inputEnabled = true;
    this.tryBtn.events.onInputDown.add(create, this);
    this.graphics.addChild(this.doneText);
    this.graphics.addChild(this.tryBtn);
    this.game.add.tween(btn).to({x:this.doneText.x,y:this.doneText.y+this.doneText.height*1.5}, 500, Phaser.Easing.Linear.None,true);
}

function buttonDown(btn){
	this.sfx.play();
	this.selected = btn.status;

	if(this.selected == "1000 more"){
		this.option2.kill();
	}
	else{
		this.option1.kill();
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
    this.text = game.add.text(0, 0, "If 6920 becomes 5920, is it:", this.textStyle2);
 	this.text.anchor.set(0.5);
    this.text.position.x += this.graphics.width*0.5;
    this.text.position.y += this.text.height*1.5;

	var text1 = game.add.text(0, 0, "1000 more", this.textStyle2);
	text1.anchor.set(0.5);
    this.option1 = game.add.sprite(this.graphics.width*0.5, this.graphics.height*0.3, 'button');
 	this.option1.anchor.set(0.5);
    this.option1.position.x -= this.option1.width*0.8;
    this.option1.position.y += this.option1.height*2;
    this.option1.status = "1000 more";
 	this.option1.addChild(text1);
 	this.option1.inputEnabled = true;
    this.option1.events.onInputDown.add(buttonDown, this);

	var text2 = game.add.text(0, 0, "1000 less", this.textStyle2);
	text2.anchor.set(0.5);
    this.option2 = game.add.sprite(this.graphics.width*0.5, this.graphics.height*0.3, 'button');
 	this.option2.anchor.set(0.5);
    this.option2.position.x += this.option2.width*0.8;
    this.option2.position.y += this.option2.height*2;
    this.option2.status = "1000 less";
    this.option2.addChild(text2);
    this.option2.inputEnabled = true;
    this.option2.events.onInputDown.add(buttonDown, this);
    ////////////////////////////////

	this.graphics.addChild(this.text);
	this.graphics.addChild(this.option1);
	this.graphics.addChild(this.option2);

	game.flexcale.onResize.add(function (scale) {
		this.graphics.scale.setTo(scale);
		this.graphics.alignIn(game.world, Phaser.CENTER);
	});

	game.flexcale.resize();
}
