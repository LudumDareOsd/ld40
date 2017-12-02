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
    this.speed = 300;
    this.velocity = 0;
    this.util = new Util();
  }

  update() {
    let pathPoint = this.path.get(this.pathIndex);
    this.accelerateTo(pathPoint, this.speed);

    this.checkPath(pathPoint);

    //this.util.constrainVelocity(this, 15);
  }

  accelerateTo(goal, speed) {

    this.body.damping = 0.94;
    this.body.setZeroRotation();
    this.body.thrust(800);

    
    
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.rotateLeft(50);
            }
            else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.body.rotateRight(50);
            }
            

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
