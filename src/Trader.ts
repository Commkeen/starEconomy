class Trader
{
    static readonly SPEED:number = 80;

    public sprite:Phaser.Sprite;

    public money:Number;
    public cargoCap:Number;
    public cargo:Array<Number>;

    public destination:StarSystem;

    constructor(game:Phaser.Game, x:number, y:number)
    {
        this.sprite = game.add.sprite(x,y,'trader');
        game.physics.enable(this.sprite);
        this.sprite.anchor.set(.5,.5);
        this.destination = null;
    }

    public update()
    {
        this.updateTimers();
        this.updateMovement();
    }

    public updateTimers()
    {

    }

    public updateMovement()
    {
        if (this.destination == null)
        {
            var starsByDistance = StarEconomy.GetInstance().universe.getStarsByDistance(this.sprite.position);
            this.setDestination(starsByDistance[Math.floor(Math.random()*3) + 1]);
            this.beginMovementTowardDestination();
        }

        if (this.destination != null)
        {
            if (this.sprite.overlap(this.destination.sprite))
            {
                this.destination = null;
            }
        }
    }

    public setDestination(star:StarSystem)
    {
        this.destination = star;
    }

    public beginMovementTowardDestination()
    {
        let targetAngle = Phaser.Math.angleBetweenPoints(this.sprite.position, this.destination.sprite.position);
        this.sprite.rotation = targetAngle + Math.PI/2;
        this.sprite.game.physics.arcade.moveToObject(this.sprite, this.destination.sprite, Trader.SPEED);
    }
}