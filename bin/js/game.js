var SimpleGame = (function () {
    function SimpleGame() {
        // create our phaser game
        // 800 - width
        // 600 - height
        // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
        // 'content' - the name of the container to add our game to
        // { preload:this.preload, create:this.create} - functions to call for our states
        this.game = new Phaser.Game(240, 160, Phaser.CANVAS, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render }, false, false);
    }
    SimpleGame.prototype.preload = function () {
        // add our player image to the assets class under the
        // key 'player'. We're also setting the background colour
        // so it's the same as the background colour in the image
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.setMinMax(240, 160, 240 * 6, 160 * 6);
        this.game.scale.windowConstraints.bottom = 'visual';
        this.game.stage.smoothed = false;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.load.spritesheet('clara', "assets/clara.png", 48, 48);
        this.game.load.spritesheet('terrain', "assets/crystalCaves.png", 32, 32);
        this.game.load.tilemap('caveRoom', 'assets/caveRoom.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.stage.backgroundColor = 0xFAFAFA;
        this.game.debug.renderShadow = false;
        this.game.debug.lineHeight = 8;
    };
    SimpleGame.prototype.create = function () {
        // add the 'player' sprite to the game, position it in the
        // center of the screen, and set the anchor to the center of
        // the image so it's centered properly. There's a lot of
        // centering in that last sentence
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var tilemap = this.game.add.tilemap('caveRoom');
        tilemap.addTilesetImage('foregroundTiles', 'terrain');
        this.foreground = tilemap.createLayer('foreground');
        tilemap.setCollisionBetween(1, 10000, true, this.foreground);
        this.foreground.resizeWorld();
        this.player = new PlayerSprite(this.game, 50, 400);
        this.game.camera.follow(this.player.sprite);
        this.game.camera.deadzone = new Phaser.Rectangle(60, 40, 120, 40);
        this.game.physics.arcade.gravity.y = 100;
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.player.sprite, this.foreground);
        this.player.update();
    };
    SimpleGame.prototype.render = function () {
        //this.game.debug.text(this.player._jumpTimer.toString(),2,12,'rgb(0,0,0)')
        //this.game.debug.cameraInfo(this.game.camera,2,2,'rgb(0,0,0)');
        //this.game.debug.spriteCoords(this.player.sprite,2,64,'rgb(0,0,0)');
    };
    return SimpleGame;
}());
// when the page has finished loading, create our game
window.onload = function () {
    var game = new SimpleGame();
};
var PlayerSprite = (function () {
    function PlayerSprite(game, x, y) {
        this._facingRight = true;
        this._attacking = false;
        this._jumpTimer = 0;
        this.sprite = game.add.sprite(x, y, 'clara');
        this.sprite.anchor.set(.4, 1);
        game.physics.enable(this.sprite);
        this.body = this.sprite.body;
        this.body.gravity.y = PlayerSprite.GRAVITY;
        this.sprite.animations.add('stand', [1]);
        this.sprite.animations.add('walk', [9, 10, 11, 6, 7, 8], 8, true);
        this.sprite.animations.add('jumpUp', [12]);
        this.sprite.animations.add('jumpHang', [13]);
        this.sprite.animations.add('jumpDown', [14]);
        this.sprite.animations.add('land', [15]);
        this.sprite.animations.add('attackStand', [2, 3, 3, 4, 5], 8, false);
        this.sprite.animations.add('attackAir', [2, 3, 3, 4, 5], 8, false);
        this.sprite.animations.play('stand');
        this._cursors = game.input.keyboard.createCursorKeys();
        this._attackBtn = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this._jumpBtn = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    }
    PlayerSprite.prototype.update = function () {
        this.updateTimers();
        this.updateAttack();
        this.updateMovement();
        this.updateAnimation();
    };
    PlayerSprite.prototype.updateTimers = function () {
        var elapsed = this.sprite.game.time.physicsElapsed;
        if (this._jumpTimer > 0) {
            this._jumpTimer -= elapsed;
        }
    };
    PlayerSprite.prototype.updateAttack = function () {
        //Start attack
        if (!this._attacking && this._attackBtn.justDown) {
            this._attacking = true;
            this.body.onFloor() ? this.sprite.animations.play('attackStand') : this.sprite.animations.play('attackAir');
        }
        //End attack when animation is finished
        if (this._attacking && this.sprite.animations.currentAnim.isFinished) {
            this._attacking = false;
        }
        //End air attack when you land
        if (this.sprite.animations.currentAnim.name == 'attackAir' && this.body.onFloor()) {
            this._attacking = false;
        }
    };
    PlayerSprite.prototype.updateMovement = function () {
        var groundAtk = this.sprite.animations.currentAnim.name == 'attackStand';
        //Reset jump on floor
        if (this.body.onFloor()) {
            this._jumpTimer = 0;
        }
        //Initiate jump
        if (!groundAtk && this._jumpBtn.justDown && this.body.onFloor()) {
            this._jumpTimer = PlayerSprite.JUMP_IMPULSE_TIME;
        }
        //Keep a jump impulse going while holding jump in the air
        if (this._jumpBtn.isDown && this._jumpTimer > 0) {
            this.body.velocity.y = PlayerSprite.JUMP_IMPULSE * -1;
        }
        else {
            this._jumpTimer = 0;
        }
        if (!groundAtk && this._cursors.left.isDown) {
            this.body.velocity.x = PlayerSprite.SPEED * -1;
            this._facingRight = false;
        }
        else if (!groundAtk && this._cursors.right.isDown) {
            this.body.velocity.x = PlayerSprite.SPEED;
            this._facingRight = true;
        }
        else {
            this.body.velocity.x = 0;
        }
    };
    PlayerSprite.prototype.updateAnimation = function () {
        this.sprite.scale.x = this._facingRight ? 1 : -1;
        if (this._attacking) {
            return;
        }
        if (this._jumpTimer > 0) {
            this.sprite.animations.play('jumpUp');
            return;
        }
        if (!this.body.onFloor() && this.body.velocity.y < 15) {
            this.sprite.animations.play('jumpHang');
            return;
        }
        if (!this.body.onFloor()) {
            this.sprite.animations.play('jumpDown');
            return;
        }
        if (this.body.onFloor() &&
            (this.sprite.animations.currentAnim.name == 'jumpDown' || this.sprite.animations.currentAnim.name == 'attackAir')) {
            this.sprite.animations.play('land');
            return;
        }
        if (Math.abs(this.body.velocity.x) > 0) {
            this.sprite.animations.play('walk');
        }
        else {
            this.sprite.animations.play('stand');
        }
    };
    return PlayerSprite;
}());
PlayerSprite.SPEED = 60;
PlayerSprite.JUMP_IMPULSE = 180;
PlayerSprite.JUMP_IMPULSE_TIME = .15;
PlayerSprite.GRAVITY = 500;
