export class UndoStack<T> {
    private maxSize: number = 100;
    private index: number;
    private values: T[];

    constructor() {
        this.index = -1;
        this.values = [];
    }

    undo(): T | undefined {
        this.index -= 1;

        this.clampIndex();

        return this.current;
    }
    
    redo(): T | undefined {
        this.index += 1;

        this.clampIndex();

        return this.current;
    }

    private clampIndex() {
        if(this.index < 0) this.index = 0;
        if(this.index >= this.values.length) this.index = this.values.length - 1;
    }

    get current(): T | undefined {
        if(this.index >= 0 && this.index <= this.values.length) {
            const value = this.values[this.index];

            return value;
        }
        
        return undefined;
    }

    push(value: T) {
        if(this.index + 1 < this.values.length) {
            this.values = this.values.slice(0, this.index + 1);
        }
        
        this.values.push(value);
        this.index = this.values.length - 1;

        return this.current;
    }

    clear() {
        this.index = 0;
        this.values = [];
    }
}