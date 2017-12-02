import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.8);
    this.scale.setTo(2);
  }

  update () {
      
    this.body.damping = 0.94;
    this.body.setZeroRotation();
      
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.body.rotateLeft(50);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.body.rotateRight(50);
        }
        this.body.thrust(800);
        
    } else {
        if(Math.abs(this.body.velocity.x) > 100 || Math.abs(this.body.velocity.y) > 100) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.body.rotateLeft(10);
            } 
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                this.body.rotateRight(10);
            }
        }

    }      
      
    //this.body.velocity.x = 0;
 
    /*
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.body.rotateLeft(30);
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.rotateRight(30);
    } else {
        this.body.setZeroRotation();
    }
      
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.body.thrust(400);
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.body.reverse(100);
    } else {
        this.body.damping = 0.8;
    }
    */
      
    this.constrainVelocity(15);
  }
    
// http://www.html5gamedevs.com/topic/9835-is-there-a-proper-way-to-limit-the-speed-of-a-p2-body/
  constrainVelocity(maxVelocity) {
      var body = this.body;
      var angle, currVelocitySqr, vx, vy;

      vx = body.data.velocity[0];
      vy = body.data.velocity[1];

      currVelocitySqr = vx * vx + vy * vy;
      //console.log('currVelocity: '+currVelocitySqr);

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
