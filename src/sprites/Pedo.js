import Phaser from 'phaser';
import Util from '../util/util';
// 9 x 23

export default class extends Phaser.Sprite {
    constructor(game, x, y, asset, playerCollisionGroup, opponentCollisionGroup, pedoCollisionGroup) {
        super(game, x, y, asset);
        this.game = game;
        this.util = new Util();
        this.scale.setTo(2);

        this.game.add.existing(this);
        this.game.physics.p2.enable(this, false);
        // var pedoCollisionGroup;
        this.body.setCollisionGroup(pedoCollisionGroup);
        this.body.collides(opponentCollisionGroup, this.pedoVScar, this);
        this.body.collides(playerCollisionGroup, this.pedoVScar, this);
        this.walk = this.animations.add('walk');
        this.animations.play('walk', 3, true);

        this.mx = 0;
        this.my = 0;
    }

    update() {
        this.mx += (Math.random() - 0.5) * 0.1;
        this.my += (Math.random() - 0.5) * 0.1;
        this.util.clamp(-1, 1, this.mx);
        this.util.clamp(-1, 1, this.my);
        this.body.x += this.mx;
        this.body.y += this.my;
        if (this.mx > 0) {
            this.scale.setTo(-2, 2);
        } else {
            this.scale.setTo(2, 2);
        }
    }

    pedoVScar(pedo, car) {
<<<<<<< HEAD
        //console.log('COLLIDE');
=======
>>>>>>> c1edfe703da49a8173c2b364cb5adbf46f0d7471
        this.kill();
    }

}