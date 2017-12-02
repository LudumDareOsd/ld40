import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, type, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup) {
        super(game, x, y, asset);
        this.game = game;
        this.type = type;
        this.scale.setTo(3);

        this.game.add.existing(this); 
        this.game.physics.p2.enable(this, false);
        this.body.setCollisionGroup(powerUpCollisionGroup);
        this.body.collides(opponentCollisionGroup);
        this.body.collides(playerCollisionGroup, this.playerTakesPowerup, this);
    }

    playerTakesPowerup(powSprite, playerSprite) {

        if(this.type == 'nos') {
            powSprite.sprite.alpha -= 0.20;
        }
    }
}