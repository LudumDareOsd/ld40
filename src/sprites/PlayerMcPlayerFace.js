import Phaser from 'phaser';
import Util from '../util/util';

export default class extends Phaser.Sprite {
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset);
        this.anchor.setTo(0.5, 0.8);
        this.scale.setTo(2);
        this.util = new Util();
    }

    update() {

        this.body.damping = 0.94;
        this.body.setZeroRotation();

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.rotateLeft(50);
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.rotateRight(50);
            }
            this.body.thrust(800);

        } else {
            if (Math.abs(this.body.velocity.x) > 100 || Math.abs(this.body.velocity.y) > 100) {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.body.rotateLeft(10);
                }
                else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.body.rotateRight(10);
                }
            }

        }

        this.util.constrainVelocity(this, 15);
    }

    // http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/

}
