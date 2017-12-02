import Phaser from 'phaser'
import HudSpeedometer from '../sprites/HudSpeedometer'

export default class extends Phaser.Group {
  constructor ({ game, parent }) {
    super(game, parent);
    this.game = game;
    this.anchor.setTo(0.0, 0.0);
    this.scale.setTo(2);
      
    var hudSpeedometer = new HudSpeedometer({
      game: game,
      x: 0,
      y: 0,
      asset: 'hud-speedometer'
    });
      
    this.hudSpeedometer.fixedToCamera = true;
      
    this.add(this.hudSpeedometer);
  }
}