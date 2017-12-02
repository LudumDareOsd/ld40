import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor(game, x, y, asset, path, powerUpCollisionGroup) {
    super(game, x, y, asset);
    this.game = game;
    this.game.physics.p2.enable(this, false);
    this.game.add.existing(this);
    this.scale.setTo(2);
    this.anchor.setTo(0.5);
    this.pathIndex = 0;
    this.path = path;
    this.body.collides(powerUpCollisionGroup, this.onPowerUp, this.game);
  }

  update() {
    let pathPoint = this.path.get(this.pathIndex);
    this.accelerateTo(pathPoint, 60);

    this.checkPath(pathPoint);
  }

  accelerateTo(goal, speed) {
    if (typeof speed === 'undefined') { speed = 60; }
    var angle = Math.atan2(goal.y - this.y, goal.x - this.x);
    this.body.rotation = angle + game.math.degToRad(90);
    this.body.force.x = Math.cos(angle) * speed;
    this.body.force.y = Math.sin(angle) * speed;
  }

  onPowerUp() {
    console.log("Derp");
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
