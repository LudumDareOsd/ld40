import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    //this.load.image('playercar', 'assets/images/player.png');
    this.load.image('playercar', 'assets/images/player-base.png');
    this.load.image('car', 'assets/images/enemy1.png');
    this.load.image('level1', 'assets/images/level1.png');
    this.load.image('level2', 'assets/images/level2.png');
    this.load.image('level3', 'assets/images/level3.png');
    this.load.image('nos', 'assets/images/Speed-NOS.png');
    this.load.image('hud-speedometer', 'assets/images/Speedometer.png');
    this.load.image('hud-speedpin', 'assets/images/speed-pin.png');
    this.load.image('hud-powerup', 'assets/images/Powerup-Display.png');
    this.load.image('hud-goreometer', 'assets/images/Gore-O-Meter.png');
  }

  create () {
    game.canvas.oncontextmenu = function (e) { e.preventDefault(); } // disable right click menu on canvas
    this.state.start('Game')
  }
}
