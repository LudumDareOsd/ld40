import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, type, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, playerObject, stateUsed) {
        super(game, x, y, asset);
        this.game = game;
        this.type = type;
        this.thePlayer = playerObject;
        this.stateUse = stateUsed;
        this.scale.setTo(3);

        // *** NOS
        this.nosTimeSec = 3;
        this.nosThrust = 800;

        this.game.add.existing(this);
        this.game.physics.p2.enable(this, false);
        this.body.setCollisionGroup(powerUpCollisionGroup);
        this.body.collides(opponentCollisionGroup, this.removePowerUp, this);
        this.body.collides(playerCollisionGroup, this.playerTakesPowerup, this);
    }

    playerTakesPowerup(powSprite, playerSprite) {

        if (this.type == 'nos') {
            powSprite.sprite.kill();
            this.thePlayer.addThrust(this.nosThrust, this.nosTimeSec);
            this.stateUse.removePowerup(this.type);
        }
    }

    removePowerUp(powSprite) {
        powSprite.sprite.kill();
    }
}