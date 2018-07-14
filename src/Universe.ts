class Universe
{
    static readonly MARGIN:number = 50;
    static readonly WIDTH:number = 800;
    static readonly HEIGHT:number = 600;

    public stars:Array<StarSystem>;

    public constructor(game:Phaser.Game)
    {
        this.generateStars(game,Universe.WIDTH,Universe.HEIGHT);
    }

    public getStarsByDistance(point:Phaser.Point):Array<StarSystem>
    {
        let results = this.stars.sort((a,b) => Phaser.Point.distance(a.sprite,point) - Phaser.Point.distance(b.sprite,point));
        return results;
    }

    private generateStars(game:Phaser.Game, width:number, height:number)
    {
        this.stars = new Array<StarSystem>();
        for (let i = 0; i < 20; i++)
        {
            let x = Math.random()*(width-(Universe.MARGIN*2)) + Universe.MARGIN;
            let y = Math.random()*(height-(Universe.MARGIN*2)) + Universe.MARGIN;
            let star = new StarSystem(game,x,y);
            this.stars.push(star);
        }
    }
}