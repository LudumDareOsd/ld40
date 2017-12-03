import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y) {

        var rect = game.make.bitmapData(300, 300);
        // rect.ctx.fillStyle = 'rgba(255,0,0,0.15)';
        rect.ctx.fillStyle = 'rgba(255,0,0,0.0)';
        rect.ctx.fillRect(0, 0, 300, 300);
        
        super(game, x, y, rect);
    }


}