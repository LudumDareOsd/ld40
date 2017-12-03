import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, type, powerUpCollisionGroup, opponentCollisionGroup, playerCollisionGroup, playerObject, stateUsed) {
        super(game, x, y, asset);
        this.game = game;
        this.type = type;
        this.thePlayer = playerObject;
        this.stateUse = stateUsed;
        this.powerUpCollisionGroup = powerUpCollisionGroup;
        this.opponentCollisionGroup = opponentCollisionGroup;
        this.playerCollisionGroup = playerCollisionGroup;
        this.scale.setTo(3);

        // *** NOS
        this.nosTimeSec = 3;
        this.nosThrust = 800;

        this.game.add.existing(this);
        this.game.physics.p2.enable(this, false);
        this.body.setCollisionGroup(powerUpCollisionGroup);
        this.body.collides(opponentCollisionGroup, this.opponentTakesPowerUp, this);
        this.body.collides(playerCollisionGroup, this.playerTakesPowerup, this);
    }

    playerTakesPowerup(powSprite, playerSprite) {

        if (this.type == 'nos') {
            powSprite.sprite.kill();
            this.thePlayer.addPow(this.type, this.nosThrust, this.nosTimeSec);
            this.stateUse.removePowerup(this.type); // remove from game/state
            this.stateUse.showPowOnHud(this.type);
            this.stateUse.renewRemovedPowerup(this.type, this.powerUpCollisionGroup, this.opponentCollisionGroup, this.playerCollisionGroup,); // add a new one
        } else if (this.type == 'carwash') {
            powSprite.sprite.kill();
            this.thePlayer.addPow(this.type, 0, 0);
            this.stateUse.removePowerup(this.type); // remove from game/state
            this.stateUse.showPowOnHud(this.type);
            this.stateUse.renewRemovedPowerup(this.type, this.powerUpCollisionGroup, this.opponentCollisionGroup, this.playerCollisionGroup,); // add a new one
        }
        
    }

    opponentTakesPowerUp(powSprite) {
        powSprite.sprite.kill();
        this.stateUse.removePowerup(this.type); // remove from game/state
        this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {
            this.stateUse.renewRemovedPowerup(this.type, this.powerUpCollisionGroup, this.opponentCollisionGroup, this.playerCollisionGroup,); // add a new one
        }, this);
    }
}