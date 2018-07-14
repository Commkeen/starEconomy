class StarSystem
{

    public market:Market;
    public starType:string;
    public sprite:Phaser.Sprite;

    constructor(game:Phaser.Game, x:number, y:number)
    {
        this.sprite = game.add.sprite(x,y,'star');
        this.sprite.anchor.set(.5,.5);
    }

    public update()
    {
        
    }
}