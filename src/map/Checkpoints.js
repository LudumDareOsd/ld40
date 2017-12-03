import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y) {

        var rect = game.make.bitmapData(50, 50);
        rect.ctx.fillStyle = 'rgba(255,0,255,0.15)';
        rect.ctx.fillRect(0, 0, 50, 50);

        super(game, x, y, rect);
    }


}