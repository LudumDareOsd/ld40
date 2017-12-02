/* globals __DEV__ */
import Phaser from 'phaser';

import Opponent from '../sprites/Opponent';

export default class extends Phaser.State {

  init() { }
  preload() { }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
   
    this.createOpponents();
  }

  render() {
    if (__DEV__) {
      
    }
  }

  createOpponents() {
    this.opponents = this.game.add.group();

    let opponent = new Opponent(game, 100, 100, 'car');

    this.game.physics.p2.enable(opponent, false);

    this.game.add.existing(opponent);
  }
}
