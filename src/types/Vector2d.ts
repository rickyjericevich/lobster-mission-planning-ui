export default class Vector2d {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }


    static fromArray(arr: number[]): Vector2d {
        return new Vector2d(arr[0], arr[1]);
    }

    toArray(): number[] {
        return [this.x, this.y];
    }

    distance(other: Vector2d): number {
        return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
    }

    add(other: Vector2d): Vector2d {
        return new Vector2d(this.x + other.x, this.y + other.y);
    }

    perpendicular_unit_vector(): Vector2d {
        const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
        return new Vector2d(-this.y / magnitude, this.x / magnitude);
    }

    scale(scalar: number): Vector2d {
        return new Vector2d(this.x * scalar, this.y * scalar);
    }

    dot(other: Vector2d): number {
        return this.x * other.x + this.y * other.y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}