/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/PlayerMcPlayerFace'
import Opponent from '../sprites/Opponent';
import Map from '../map/Map';

export default class extends Phaser.State {

  init() { }
  preload() { }

  create() {
    //this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.setImpactEvents(true);
    this.physics.p2.restitution = 0.8;
      
    this.map = new Map();
      
    this.player = new Player({
      game: this.game,
      x: 150,
      y: 150,
      asset: 'playercar'
    });

    var playerCollisionGroup = this.physics.p2.createCollisionGroup();
    var opponentCollisionGroup = this.physics.p2.createCollisionGroup();

    this.physics.p2.updateBoundsCollisionGroup();

    this.physics.p2.enable(this.player, false);
    this.player.body.setCircle(16);
    this.player.body.setCollisionGroup(playerCollisionGroup);
    this.player.body.collides(opponentCollisionGroup, this.hitEnemy, this);

    this.map.loadMap(1);
    this.game.add.existing(this.player);
    this.createOpponents();
  }
    
  hitPlayerOrOpponent(body1, body2) {
    body2.sprite.alpha -= 0.05;
  }
    
  hitEnemy(body1, body2) {
    body2.sprite.alpha -= 0.20;
  }

  render() {
    this.map.render();
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }

  createOpponents() {
    this.opponents = this.game.add.group();

    let opponent = new Opponent(game, 100, 100, 'car');

    this.game.physics.p2.enable(opponent, false);

    this.game.add.existing(opponent);
  }
}
