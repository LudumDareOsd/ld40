import Phaser from 'phaser';

export default class extends Phaser.Sprite {
    constructor(game, x, y) {

        

        var rect = game.make.bitmapData(200, 200);
        rect.ctx.fillStyle = '#ff0000';
        rect.ctx.fillRect(0, 0, 200, 200);
        
        super(game, x, y, rect);
    }


}