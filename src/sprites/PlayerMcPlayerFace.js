import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
  }

  update () {
    //this.body.velocity.x = 0;
 
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.body.rotateLeft(30);
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.rotateRight(30);
    } else {
        this.body.setZeroRotation();
    }
      
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.body.thrust(200);
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.body.reverse(100);
    } else {
        this.body.damping = 0.6;
    }
      
    this.constrainVelocity(100);
  }
    
// http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/
  constrainVelocity(maxVelocity) {
      var body = this.body;
      var angle, currVelocitySqr, vx, vy;

      vx = body.data.velocity[0];
      vy = body.data.velocity[1];

      currVelocitySqr = vx * vx + vy * vy;

      if (currVelocitySqr > maxVelocity * maxVelocity) {
        angle = Math.atan2(vy, vx);


        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;

        body.data.velocity[0] = vx;
        body.data.velocity[1] = vy;
        console.log('limited speed to: '+maxVelocity);
      }
  };
}
