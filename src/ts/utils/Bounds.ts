export class Bounds {
    constructor(
        public readonly left: number,
        public readonly right: number,
        public readonly top: number,
        public readonly bottom: number,
    ) { }

    get x () { return this.left; }
    get y () { return this.top; }
    get width() { return this.right - this.left; }
    get height() { return this.bottom - this.top; }

    get centerX() { return (this.left + this.right) * 0.5; }
    get centerY() { return (this.top + this.bottom) * 0.5; }
}