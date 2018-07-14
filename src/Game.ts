class StarEconomy
{
	game:Phaser.Game;

	public universe:Universe;
	public traders:Array<Trader>;
	
	public static _instance:StarEconomy;
	public static GetInstance():StarEconomy {return StarEconomy._instance;}

	constructor()
	{
		this.game = new Phaser.Game( 800, 600, Phaser.CANVAS, 'content', { preload:this.preload, create:this.create, update:this.update, render:this.render}, false, false );	
	}
	
	preload()
	{
		// add our player image to the assets class under the
		// key 'player'. We're also setting the background colour
		// so it's the same as the background colour in the image
		
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//this.game.scale.setMinMax(240, 160, 240*6, 160*6);
		this.game.scale.windowConstraints.bottom = 'visual';
		this.game.stage.smoothed = false;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.game.load.spritesheet( 'star', "assets/star.png", 32, 32);
		this.game.load.spritesheet('trader', "assets/ship.png", 9,13);
		this.game.stage.backgroundColor = 0xDADADA;

		this.game.debug.renderShadow = false;
		this.game.debug.lineHeight = 8;

		this.game.stage.disableVisibilityChange = true;
	}
	
	create()
	{
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		StarEconomy.GetInstance().universe = new Universe(this.game);
		StarEconomy.GetInstance().traders = new Array<Trader>();
		StarEconomy.GetInstance().traders.push(new Trader(this.game,100,100));
	}

	update()
	{
		StarEconomy.GetInstance().traders[0].update();
	}

	render()
	{
		//this.game.debug.text(this.player._jumpTimer.toString(),2,12,'rgb(0,0,0)')
		//this.game.debug.cameraInfo(this.game.camera,2,2,'rgb(0,0,0)');
		//this.game.debug.spriteCoords(this.player.sprite,2,64,'rgb(0,0,0)');
	}
}

// when the page has finished loading, create our game
window.onload = () => {
	StarEconomy._instance = new StarEconomy();
}