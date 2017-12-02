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
    }
    create() { }
    render() { }

}
