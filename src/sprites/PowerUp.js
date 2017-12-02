import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, type, powerUpCollisionGroup) {
        super(game, x, y, asset);
        this.game = game;
        this.type = type;

        this.game.add.existing(this); 
        this.game.physics.p2.enable(this, false);
        this.body.setCollisionGroup(powerUpCollisionGroup);
    }
}