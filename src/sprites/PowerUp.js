import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, type, powerUpCollisionGroup) {
        
        var rect = game.make.bitmapData(20, 20);

        rect.ctx.fillStyle = '#ff0000';

        rect.ctx.fillRect(0, 0, 20, 20);

        super(game, x, y, rect);
        this.game = game;
        this.type = type;

        this.game.add.existing(this); 
        this.game.physics.p2.enable(this, false);
        this.body.setCollisionGroup(powerUpCollisionGroup);
    }
}