class SimpleGame
{
	game:Phaser.Game;
	cursors:Phaser.CursorKeys;
	player:PlayerSprite;
	foreground:Phaser.TilemapLayer;
	
	constructor()
	{
		// create our phaser game
		// 800 - width
		// 600 - height
		// Phaser.AUTO - determine the renderer automatically (canvas, webgl)
		// 'content' - the name of the container to add our game to
		// { preload:this.preload, create:this.create} - functions to call for our states
		this.game = new Phaser.Game( 240, 160, Phaser.CANVAS, 'content', { preload:this.preload, create:this.create, update:this.update, render:this.render}, false, false );
		
	}
	
	preload()
	{
		// add our player image to the assets class under the
		// key 'player'. We're also setting the background colour
		// so it's the same as the background colour in the image
		
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.setMinMax(240, 160, 240*6, 160*6);
		this.game.scale.windowConstraints.bottom = 'visual';
		this.game.stage.smoothed = false;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

		this.game.load.spritesheet( 'clara', "assets/clara.png", 48, 48);
		this.game.load.spritesheet('terrain', "assets/crystalCaves.png", 32,32);
		this.game.load.tilemap('caveRoom', 'assets/caveRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.stage.backgroundColor = 0xFAFAFA;

		this.game.debug.renderShadow = false;
		this.game.debug.lineHeight = 8;
	}
	
	create()
	{
		// add the 'player' sprite to the game, position it in the
		// center of the screen, and set the anchor to the center of
		// the image so it's centered properly. There's a lot of
		// centering in that last sentence
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		var tilemap = this.game.add.tilemap('caveRoom');
		tilemap.addTilesetImage('foregroundTiles', 'terrain');
		this.foreground = tilemap.createLayer('foreground');
		tilemap.setCollisionBetween(1,10000,true,this.foreground);
		this.foreground.resizeWorld();

		this.player = new PlayerSprite(this.game, 50, 400);
		this.game.camera.follow(this.player.sprite);
		this.game.camera.deadzone = new Phaser.Rectangle(60,40,120,40);
		
		this.game.physics.arcade.gravity.y = 100;

	}

	update()
	{
		this.game.physics.arcade.collide(this.player.sprite, this.foreground);
		this.player.update();
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
	var game = new SimpleGame();
}