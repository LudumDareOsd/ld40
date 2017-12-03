/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

    init() { }
    preload() {
        this.aboutPage = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'about-page')
        this.aboutPage.x = 0;
        this.aboutPage.y = 0;
        this.aboutPage.width = this.game.width;
        this.aboutPage.height = this.game.height;
        this.aboutPage.smoothed = false;

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
