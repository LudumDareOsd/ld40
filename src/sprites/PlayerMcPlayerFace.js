import Phaser from 'phaser';
import Util from '../util/util';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5, 0.8);
        this.scale.setTo(2);
        this.util = new Util();
        this.maxThrust = 800;
        this.addedThrust = 0;
    }

    update() {

        this.body.damping = 0.94;
        this.body.setZeroRotation();

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
                this.body.rotateLeft(50);
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                this.body.rotateRight(50);
            }
            this.body.thrust(this.maxThrust + this.addedThrust);

        } else {
            if (Math.abs(this.body.velocity.x) > 100 || Math.abs(this.body.velocity.y) > 100) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
                    this.body.rotateLeft(10);
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
                    this.body.rotateRight(10);
                }
            }

        }

        //this.util.constrainVelocity(this, 15);
    }

    addThrust(addThrust, removeThrustSec) {
        this.addedThrust = addThrust;

        this.game.time.events.add(Phaser.Timer.SECOND * removeThrustSec, function() {
            this.removeThrust();
        }, this);
    }

    removeThrust() {
        this.addedThrust = 0;
    }

    // http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/

}
