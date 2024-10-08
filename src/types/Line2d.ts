import Vector2d from "./Vector2d";
import LineSegment2d from "./LineSegment2d";

export default class Line2d {
    anchor: Vector2d;
    direction: Vector2d;

    constructor(anchor: Vector2d, direction: Vector2d) {
        this.anchor = anchor;
        this.direction = direction;
    }

    point_at_distance(distance: number): Vector2d {
        return this.anchor.add(this.direction.scale(distance));
    }

    perpendicular_line(): Line2d {
        return new Line2d(this.anchor, this.direction.perpendicular_unit_vector());
    }

    parallel_line_at_distance(distance: number): Line2d {
        return new Line2d(
            this.perpendicular_line().point_at_distance(distance),
            this.direction
        )
    }

    intersection(segment: LineSegment2d): Vector2d | undefined { // https://stackoverflow.com/a/60368757
        const p2 = this.point_at_distance(1); // assumes p2 != this.anchor

        const det = (p2.x - this.anchor.x) * (segment.end.y - segment.start.y) - (segment.end.x - segment.start.x) * (p2.y - this.anchor.y);
        if (det === 0) return;

        const line_alpha = ((segment.end.y - segment.start.y) * (segment.end.x - this.anchor.x) + (segment.start.x - segment.end.x) * (segment.end.y - this.anchor.y)) / det;
        const segment_alpha = ((this.anchor.y - p2.y) * (segment.end.x - this.anchor.x) + (p2.x - this.anchor.x) * (segment.end.y - this.anchor.y)) / det;
        if (0 < segment_alpha && segment_alpha < 1) return this.point_at_distance(line_alpha);
    };

    toString(): string {
        return `Line2d( ${this.anchor} + α ${this.direction} )`;
    }
};