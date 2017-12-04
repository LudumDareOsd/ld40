import PathPoint from './PathPoint'

export default class {
    constructor(game) {
        this.game = game;
        this.pathPoints = [];
    }

    add(x, y, show) {
        let pathPoint = new PathPoint(this.game, x, y, show ? 'rgba(255,0,0,0.1)' : 'rgba(255,0,0,0.0)');
        this.game.add.existing(pathPoint)
        this.pathPoints.push(pathPoint);
    }

    get(index) {
        return this.pathPoints[index];
    }
}