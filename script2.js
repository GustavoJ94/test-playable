
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
	this.answer = 4652;
	this.textStyle = { font: "bold 40px Arial", fill: "#fff",align:"center",strokeThickness:4,stroke:"#000"};
	this.textStyle2 = { font: "bold 40px Arial", fill: "#fff",align:"center",strokeThickness:10,stroke:"#000"};
	///////////////
	game.stage.backgroundColor = this.bgColor;
	this.game.load.image('bg','assets/bg.jpg')
	this.game.load.image('button','assets/button.png')
	this.game.load.image('try','assets/try.png')
    this.game.load.audio('btnSfx', 'assets/click.ogg');
    this.game.load.audio('correct', 'assets/correct.ogg');

	game.flexcale = game.plugins.add(Phaser.Plugin.Flexcale);
	game.flexcale.setOptions({
		minWidth: this.minWidth,
		minHeight: this.minHeight,
		resolution: 1,
	});
}

function youWin(){
	this.sfxWin.play();
	this.doneText = game.add.text(0, this.text.y, "Correct", this.textStyle2);
	this.doneText.anchor.set(0.5);
    this.doneText.position.x = this.text.width*0.5+(this.doneText.width*0.7);
    this.doneText.position.y += this.doneText.height*1.5; 
    this.graphics.addChild(this.doneText);

}

function youLose(btn){
	this.doneText = game.add.text(0,  this.text.y, "Try Again", this.textStyle2);
	this.doneText.anchor.set(0.5);
    this.doneText.position.x = this.text.width*0.5+(this.doneText.width*0.5);
    this.doneText.position.y += this.doneText.height*1.5; 

    this.tryBtn = game.add.sprite(0, 0, 'try');
    this.tryBtn.anchor.set(0.5);
    this.tryBtn.position.x = this.text.width*0.5+(this.tryBtn.width*1.5);
    this.tryBtn.position.y = this.text.y+this.text.height*5; 
    this.tryBtn.inputEnabled = true;
    this.tryBtn.events.onInputDown.add(create, this);
    this.graphics.addChild(this.doneText);
    this.graphics.addChild(this.tryBtn);
}

function buttonDown(btn){
	this.sfx.play();
	this.selected = btn.myNumber;

	this.options.forEach(item =>{
		if(item.myNumber != this.selected)
			item.kill();
	});

	this.game.add.tween(btn).to({x:(this.text.width*0.5-(btn.width*0.5)),y:this.graphics.height*0.1}, 500, Phaser.Easing.Linear.None,true);

	if(this.selected == this.answer)
		youWin();
	else
		youLose(btn);
}

function createNumbers(){
    this.numbers = [0,0,0,this.answer];
    for(var i = 0; i < 3; i++){
    	var r = game.rnd.integerInRange(1000, 5000);
    	if(r == this.answer) r++;
    	this.numbers[i] = r;
    }
   
    if(this.isRandom)
    	Phaser.ArrayUtils.shuffle(this.numbers);
}

function asignNumbers(){
	var index = 0;
	this.options.forEach(btn => {
		var text = game.add.text(0, 0, this.numbers[index], this.textStyle);
		text.anchor.set(0.5);
		btn.myNumber = this.numbers[index];
		btn.anchor.set(0.5);
		btn.addChild(text);
		btn.inputEnabled = true;
    	btn.events.onInputDown.add(buttonDown, this);
		index++;
	});
}

function create() {
	this.sfx = game.add.audio('btnSfx',0.1);
	this.sfxWin = game.add.audio('correct',0.5);

	this.graphics = game.add.sprite(0, 0, 'bg');
    /////////////////////////////
    this.text = game.add.text(0, 0, "What is 1000 less of 5652?", this.textStyle2);
 	this.text.anchor.set(0.5);
    this.text.position.x += this.graphics.width*0.5;
    this.text.position.y += this.text.height*1.5;

    this.options = this.game.add.group();
    this.options.createMultiple(4, 'button',0,true);
    this.options.align(2, 2, 300, 160);
    this.options.x += this.graphics.width*0.28;
    this.options.y += this.options.height;
    this.createNumbers();
    this.asignNumbers();
    ////////////////////////////////

	this.graphics.addChild(this.text);
	this.graphics.addChild(this.options);

	game.flexcale.onResize.add(function (scale) {
		this.graphics.scale.setTo(scale);
		this.graphics.alignIn(game.world, Phaser.CENTER);
	});

	game.flexcale.resize();
}