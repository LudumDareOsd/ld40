/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

    init() { }
    preload() {
        this.gameOver = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'game-over')
        this.gameOver.x = 0;
        this.gameOver.y = 0;
        this.gameOver.width = this.game.width;
        this.gameOver.height = this.game.height;
        this.gameOver.smoothed = false;

        this.backBtn = this.game.add.button(5 * 3, 210 * 3, 'backBtn', this.onBackClick, this, 2, 1, 0);
        this.backBtn.width = 189;
        this.backBtn.height = 75;
        this.backBtn.smoothed = false;
    }
    create() { }
    render() { }

    onBackClick() {
        this.state.start('Splash')
    }

}
