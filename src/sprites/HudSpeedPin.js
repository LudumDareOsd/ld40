import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, carobject }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5, 0.0);
    this.scale.setTo(2);
    this.playerObject = carobject;
    console.log('carspeed:'+carobject.body.data.velocity[0]);
  }

  update () {

    this.angle += 1;
    //console.log('carspeed:'+this.playerObject.body.data.velocity[0]);

  }
}
