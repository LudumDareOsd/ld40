/* globals __DEV__ */
import Phaser from 'phaser';

import Opponent from '../sprites/Opponent';
import Map from '../map/Map';

export default class extends Phaser.State {

  init() { }
  preload() { }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.map = new Map();

    this.map.loadMap(1);
    this.createOpponents();
  }

  render() {
    this.map.render();
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
