class PlayerSprite
{
    static readonly SPEED = 60;
    static readonly JUMP_IMPULSE = 180;
    static readonly JUMP_IMPULSE_TIME = .15;
    static readonly GRAVITY = 500;

    _cursors:Phaser.CursorKeys;
    _attackBtn:Phaser.Key;
    _jumpBtn:Phaser.Key;
    _facingRight:boolean = true;
    _attacking:boolean = false;
    public _jumpTimer:number = 0;

    public sprite:Phaser.Sprite;
    public body:Phaser.Physics.Arcade.Body;

    constructor(game:Phaser.Game, x:number, y:number)
    {
        this.sprite = game.add.sprite(x,y,'clara');
        this.sprite.anchor.set(.4,1);

        game.physics.enable(this.sprite);
        this.body = this.sprite.body;
        this.body.gravity.y = PlayerSprite.GRAVITY;

        this.sprite.animations.add('stand', [1]);
		this.sprite.animations.add('walk', [9,10,11,6,7,8],8,true);
		this.sprite.animations.add('jumpUp', [12]);
        this.sprite.animations.add('jumpHang', [13]);
        this.sprite.animations.add('jumpDown', [14]);
        this.sprite.animations.add('land', [15]);
        this.sprite.animations.add('attackStand', [2,3,3,4,5],8,false);
        this.sprite.animations.add('attackAir', [2,3,3,4,5],8,false);
		this.sprite.animations.play('stand');

        this._cursors = game.input.keyboard.createCursorKeys();
        this._attackBtn = game.input.keyboard.addKey(Phaser.Keyboard.X);
        this._jumpBtn = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    }

    public update()
    {
        this.updateTimers();
        this.updateAttack();
        this.updateMovement();
        this.updateAnimation();
    }

    private updateTimers()
    {
        var elapsed = this.sprite.game.time.physicsElapsed;
        if (this._jumpTimer > 0)
        {
            this._jumpTimer -= elapsed;
        }
    }

    private updateAttack()
    {
        //Start attack
        if (!this._attacking && this._attackBtn.justDown)
        {
            this._attacking = true;
            this.body.onFloor() ? this.sprite.animations.play('attackStand') : this.sprite.animations.play('attackAir');
        }

        //End attack when animation is finished
        if (this._attacking && this.sprite.animations.currentAnim.isFinished)
        {
            this._attacking = false;
        }

        //End air attack when you land
        if (this.sprite.animations.currentAnim.name == 'attackAir' && this.body.onFloor())
        {
            this._attacking = false;
        }
    }

    private updateMovement()
    {
        var groundAtk = this.sprite.animations.currentAnim.name == 'attackStand';

        //Reset jump on floor
        if (this.body.onFloor())
        {
            this._jumpTimer = 0;
        }

        //Initiate jump
        if (!groundAtk && this._jumpBtn.justDown && this.body.onFloor())
        {
            this._jumpTimer = PlayerSprite.JUMP_IMPULSE_TIME;
        }

        //Keep a jump impulse going while holding jump in the air
        if (this._jumpBtn.isDown && this._jumpTimer > 0)
        {
            this.body.velocity.y = PlayerSprite.JUMP_IMPULSE*-1;
        }
        else
        {
            this._jumpTimer = 0;
        }

        if (!groundAtk && this._cursors.left.isDown)
        {
            this.body.velocity.x = PlayerSprite.SPEED*-1;
            this._facingRight = false;
        }
        else if (!groundAtk && this._cursors.right.isDown)
        {
            this.body.velocity.x = PlayerSprite.SPEED;
            this._facingRight = true;
        }
        else
        {
            this.body.velocity.x = 0;
        }
    }

    private updateAnimation()
    {
        this.sprite.scale.x = this._facingRight ? 1 : -1;

        if (this._attacking)
        {
            return;
        }
        if (this._jumpTimer > 0)
        {
            this.sprite.animations.play('jumpUp');
            return;
        }
        if (!this.body.onFloor() && this.body.velocity.y < 15)
        {
            this.sprite.animations.play('jumpHang');
            return;
        }
        if (!this.body.onFloor())
        {
            this.sprite.animations.play('jumpDown');
            return;
        }
        if (this.body.onFloor() &&
            (this.sprite.animations.currentAnim.name == 'jumpDown' || this.sprite.animations.currentAnim.name == 'attackAir'))
        {
            this.sprite.animations.play('land');
            return;
        }
        if (Math.abs(this.body.velocity.x) > 0)
        {
            this.sprite.animations.play('walk');
        }
        else
        {
            this.sprite.animations.play('stand');
        }
    }

    private onFinishAttack
}