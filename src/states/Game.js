/* globals __DEV__ */
import Phaser from 'phaser';
import Mushroom from '../sprites/Mushroom';
import Opponent from '../sprites/Opponent';

export default class extends Phaser.State {

  init() { }
  preload() { }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.mushroom = new Mushroom({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'mushroom'
    });

    this.game.add.existing(this.mushroom);

    this.createOpponents();
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }

  createOpponents() {
    var rect = game.make.bitmapData(32, 32);
    rect.ctx.fillStyle = '#aa0000';
    rect.ctx.fillRect(0, 0, 32, 32);

    this.opponents = this.game.add.group();

    let opponent = new Opponent({
      game: this.game,
      x: 100,
      y: 100,
      asset: rect
    });

    this.game.physics.p2.enable(opponent, false);

    this.game.add.existing(opponent);
  }
}
