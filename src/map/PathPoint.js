import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y) {

        var rect = game.make.bitmapData(100, 100);

        rect.ctx.fillStyle = '#ff0000';

        rect.ctx.fillRect(0, 0, 100, 100);
        
        super(game, x, y, rect);
    }
}