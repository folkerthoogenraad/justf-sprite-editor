export class ReadOnlyArray {
    static add<T>(array: T[], item: T): T[] {
        return [...array, item];
    }
    static remove<T>(array: T[], item: T): T[] {
        let index = this.indexOf(array, item);

        if(index < 0) return array;

        return this.removeAt(array, index);
    }
    static removeAt<T>(array: T[], index: number): T[] {
        return [...array.slice(0, index), ...array.slice(index + 1)];
    }
    static insert<T>(array: T[], item: T, index: number): T[] {
        return [...array.slice(0, index),item, ...array.slice(index)];
    }
    static replace<T>(array: T[], oldItem: T, newItem: T): T[] {
        let index = this.indexOf(array, oldItem);

        if(index < 0) return array;

        let result =  this.replaceAt(array, newItem, index);

        return result;
    }
    static replaceAt<T>(array: T[], item: T, index: number): T[] {
        return [...array.slice(0, index),item, ...array.slice(index + 1)];
    }
    
    static indexOf<T>(array: T[], item: T): number {
        return array.indexOf(item);
    }
    
    static swapAt<T>(array: T[], indexA: number, indexB: number): T[] {
        let result = [...array];

        result[indexA] = array[indexB];
        result[indexB] = array[indexA];

        return result;
    }
}