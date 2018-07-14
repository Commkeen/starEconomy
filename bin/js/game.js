var StarEconomy = (function () {
    function StarEconomy() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render }, false, false);
    }
    StarEconomy.GetInstance = function () { return StarEconomy._instance; };
    StarEconomy.prototype.preload = function () {
        // add our player image to the assets class under the
        // key 'player'. We're also setting the background colour
        // so it's the same as the background colour in the image
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //this.game.scale.setMinMax(240, 160, 240*6, 160*6);
        this.game.scale.windowConstraints.bottom = 'visual';
        this.game.stage.smoothed = false;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.load.spritesheet('star', "assets/star.png", 32, 32);
        this.game.load.spritesheet('trader', "assets/ship.png", 9, 13);
        this.game.stage.backgroundColor = 0xDADADA;
        this.game.debug.renderShadow = false;
        this.game.debug.lineHeight = 8;
        this.game.stage.disableVisibilityChange = true;
    };
    StarEconomy.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        StarEconomy.GetInstance().universe = new Universe(this.game);
        StarEconomy.GetInstance().traders = new Array();
        StarEconomy.GetInstance().traders.push(new Trader(this.game, 100, 100));
    };
    StarEconomy.prototype.update = function () {
        StarEconomy.GetInstance().traders[0].update();
    };
    StarEconomy.prototype.render = function () {
        //this.game.debug.text(this.player._jumpTimer.toString(),2,12,'rgb(0,0,0)')
        //this.game.debug.cameraInfo(this.game.camera,2,2,'rgb(0,0,0)');
        //this.game.debug.spriteCoords(this.player.sprite,2,64,'rgb(0,0,0)');
    };
    return StarEconomy;
}());
// when the page has finished loading, create our game
window.onload = function () {
    StarEconomy._instance = new StarEconomy();
};
var Commodity = (function () {
    function Commodity() {
    }
    return Commodity;
}());
var Market = (function () {
    function Market() {
    }
    return Market;
}());
var StarSystem = (function () {
    function StarSystem(game, x, y) {
        this.sprite = game.add.sprite(x, y, 'star');
        this.sprite.anchor.set(.5, .5);
    }
    StarSystem.prototype.update = function () {
    };
    return StarSystem;
}());
var CommodityDefinition = (function () {
    function CommodityDefinition() {
    }
    return CommodityDefinition;
}());
var Trader = (function () {
    function Trader(game, x, y) {
        this.sprite = game.add.sprite(x, y, 'trader');
        game.physics.enable(this.sprite);
        this.sprite.anchor.set(.5, .5);
        this.destination = null;
    }
    Trader.prototype.update = function () {
        this.updateTimers();
        this.updateMovement();
    };
    Trader.prototype.updateTimers = function () {
    };
    Trader.prototype.updateMovement = function () {
        if (this.destination == null) {
            var starsByDistance = StarEconomy.GetInstance().universe.getStarsByDistance(this.sprite.position);
            this.setDestination(starsByDistance[Math.floor(Math.random() * 3) + 1]);
            this.beginMovementTowardDestination();
        }
        if (this.destination != null) {
            if (this.sprite.overlap(this.destination.sprite)) {
                this.destination = null;
            }
        }
    };
    Trader.prototype.setDestination = function (star) {
        this.destination = star;
    };
    Trader.prototype.beginMovementTowardDestination = function () {
        var targetAngle = Phaser.Math.angleBetweenPoints(this.sprite.position, this.destination.sprite.position);
        this.sprite.rotation = targetAngle + Math.PI / 2;
        this.sprite.game.physics.arcade.moveToObject(this.sprite, this.destination.sprite, Trader.SPEED);
    };
    return Trader;
}());
Trader.SPEED = 80;
var Universe = (function () {
    function Universe(game) {
        this.generateStars(game, Universe.WIDTH, Universe.HEIGHT);
    }
    Universe.prototype.getStarsByDistance = function (point) {
        var results = this.stars.sort(function (a, b) { return Phaser.Point.distance(a.sprite, point) - Phaser.Point.distance(b.sprite, point); });
        return results;
    };
    Universe.prototype.generateStars = function (game, width, height) {
        this.stars = new Array();
        for (var i = 0; i < 20; i++) {
            var x = Math.random() * (width - (Universe.MARGIN * 2)) + Universe.MARGIN;
            var y = Math.random() * (height - (Universe.MARGIN * 2)) + Universe.MARGIN;
            var star = new StarSystem(game, x, y);
            this.stars.push(star);
        }
    };
    return Universe;
}());
Universe.MARGIN = 50;
Universe.WIDTH = 800;
Universe.HEIGHT = 600;
