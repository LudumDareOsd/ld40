import Phaser from 'phaser'
import Util from '../util/util';

export default class extends Phaser.Sprite {
  constructor(game, x, y, asset, path, powerUpCollisionGroup) {
    super(game, x, y, asset);
    this.scale.setTo(2);
    this.anchor.setTo(0.5);
    this.pathIndex = 0;
    this.path = path;
    this.game = game;
    this.game.physics.p2.enable(this, false);
    this.game.add.existing(this);
    this.body.collides(powerUpCollisionGroup, this.onPowerUp, this.game);
    this.velocity = 0;
    this.speed = this.game.rnd.integerInRange(800, 1200);
    this.offset = this.game.rnd.integerInRange(100, 200);
    this.util = new Util();
  }

  update() {
    let pathPoint = this.path.get(this.pathIndex);
    this.accelerateTo(pathPoint, this.speed);

    this.checkPath(pathPoint);
  }

  accelerateTo(target, speed) {

    this.body.damping = 0.94;
    this.body.setZeroRotation();
    this.body.thrust(speed);

    let deltaAngle = this.game.math.angleBetween(this.x, this.y, target.x + this.offset, target.y + this.offset);
    deltaAngle += 1.57;

    let rotation = this.game.math.rotateToAngle(this.body.rotation, deltaAngle);
    this.body.rotation = rotation;
  }

  onPowerUp(powerUp) {
    if(powerUp.type) {

    }
    console.log(powerUp);
  }  

  checkPath(pathPoint) {
    let collision = this.AABB(this, pathPoint);

    if (collision) {
      this.pathIndex++;

      if(this.pathIndex >= this.path.pathPoints.length) {
        this.pathIndex = 0;
      }   
    }
  }

  AABB(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y) {
      return true;
    }

    return false;
  }
}
