import Vector2d from './Vector2d';

export default class LineSegment2d {
    start: Vector2d;
    end: Vector2d;

    constructor(start: Vector2d, end: Vector2d) {
        this.start = start;
        this.end = end;
    }
}