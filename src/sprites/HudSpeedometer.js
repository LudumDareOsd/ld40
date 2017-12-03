import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, scale }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.0, 0.0);
    this.scale.setTo(scale);
  }

  update () {


  }
}
