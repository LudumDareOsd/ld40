import PathPoint from './PathPoint'

export default class {
    constructor(game) {
        this.game = game;
        this.pathPoints = [];
    }

    add(x, y) {
        let pathPoint = new PathPoint(this.game, x, y);
        this.game.add.existing(pathPoint)
        this.pathPoints.push(pathPoint);
    }

    get(index) {
        return this.pathPoints[index];
    }
}