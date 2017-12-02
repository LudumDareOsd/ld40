/* globals __DEV__ */
import Phaser from 'phaser';

import Opponent from '../sprites/Opponent';
import Map from '../map/Map';
import Path from '../map/Path';

export default class extends Phaser.State {

  init() { }
  preload() { }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.map = new Map();

    this.map.loadMap(1);
    
    this.path = new Path(this.game);
    this.path.add(500, 500);
    this.path.add(1000, 500);

    this.createOpponents(this.path);

    
  }

  render() {
    this.map.render();
    if (__DEV__) {
    }
  }

  createOpponents(path) {
    this.opponents = this.game.add.group();

    let opponent = new Opponent(game, 100, 100, 'car', path);

    this.game.physics.p2.enable(opponent, false);

    this.game.add.existing(opponent);
  }
}
