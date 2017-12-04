import Phaser from 'phaser';
import Util from '../util/util';
// 9 x 23

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, playerCollisionGroup, opponentCollisionGroup, pedoCollisionGroup, map) {
        super(game, x, y, asset);
        this.game = game;
        this.map = map;
        this.util = new Util();
        this.scale.setTo(2);

        this.game.add.existing(this);
        this.game.physics.p2.enable(this, false);
        this.body.collideWorldBounds = true;
        this.body.allowGravity = false;
        this.body.mass = 0.01;
        this.body.restitution = 0;
        this.body.damping = 1;
        this.body.fixedRotation = true;

        // var pedoCollisionGroup;
        this.body.setCollisionGroup(pedoCollisionGroup);
        this.body.collides(opponentCollisionGroup, this.pedoVScar, this);
        this.body.collides(playerCollisionGroup, this.pedoVScarPlayer, this);
        this.walk = this.animations.add('walk');
        this.animations.play('walk', 3, true);

        this.mx = 0;
        this.my = 0;

        this.smoothed = false;
        this.reset();
    }

    update() {
        this.mx += (Math.random() - 0.5) * 0.1;
        this.my += (Math.random() - 0.5) * 0.1;
        this.util.clamp(-1, 1, this.mx);
        this.util.clamp(-1, 1, this.my);
        this.body.x += this.mx;
        this.body.y += this.my;
        // pedos bugout at the edges? just reset them?
        if (this.body.x < 20 || this.body.x > 4066 ||
            this.body.y < 20 || this.body.y > 4066) {
            this.reset();
        }
        if (this.mx > 0) {
            this.scale.setTo(-2, 2);
        } else {
            this.scale.setTo(2, 2);
        }
    }

    pedoVScar(pedo, car) {
        this.leaveSplatter();
    }
    pedoVScarPlayer(pedo, car) {
        car.sprite.increaseGore();
        this.game.camera.shake(0.005, 400);
        this.leaveSplatter();
    }

    leaveSplatter() {
        let s = this.game.add.sprite(this.x, this.y, 'splatter');
        if (this.mx > 0) {
            s.scale.setTo(-2, 2);
        } else {
            s.scale.setTo(2, 2);
        }
        s.sendToBack();
        this.map.currentLevel.sendToBack();
        // Kill or @respawn?
        // this.kill();
        this.reset();
    }

    reset() {
      this.body.x = 100 + Math.floor(3900 * Math.random());
      this.body.y = 100 + Math.floor(3900 * Math.random());
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
      this.mx = 0;
      this.my = 0;
      this.body.angle = 0;
    }
}