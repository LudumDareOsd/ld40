import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor (game, x, y, asset) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
    this.goal = {
      x: 400,
      y: 100
    };
  }

  update () {
    this.accelerateTo(this.goal, 60);
  }

  accelerateTo(goal, speed) {
    if (typeof speed === 'undefined') { speed = 60; }
    var angle = Math.atan2(goal.y - this.y, goal.x - this.x);
    this.body.rotation = angle + game.math.degToRad(90);
    this.body.force.x = Math.cos(angle) * speed;
    this.body.force.y = Math.sin(angle) * speed;
  }
}
