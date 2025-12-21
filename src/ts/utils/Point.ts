export class Point {
    constructor(
        readonly x: number,
        readonly y: number
    ) { }

    static direction(a: Point, b: Point) {
        return new Point(b.x - a.x, b.y - a.y);
    }
    scale(n: number){ 
        return new Point(this.x * n, this.y * n);
    }
    round() {
        return new Point(Math.round(this.x), Math.round(this.y));
    }
}