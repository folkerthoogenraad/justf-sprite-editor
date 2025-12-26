import { ReadOnlyArray } from "./utils/ReadOnlyArray";

export interface SpritePropertyData {
    name?: string;
    type?: string;
    value?: any;
    hidden?: boolean;
}

export const SpritePropertyTypes = [
    "Unknown",
    "Float",
    "Integer",
    "String",
    "Boolean",
    
    // Single offsets
    "OffsetLeft",
    "OffsetRight",
    "OffsetTop",
    "OffsetBottom",

    // Vectors
    "Position", // Relative to origin
    "Direction",

    // Single offsets
    "PositionAndDirection", // Two in one! :)

    // Shapes
    "Circle",
    "Rectangle",
    "Polygon",

] as const;

export type SpritePropertyType = typeof SpritePropertyTypes[number];

export class SpriteProperty {
    constructor(
        public readonly name: string,
        public readonly type: SpritePropertyType,
        public readonly hidden: boolean,
        public readonly value: any) { }

    setName(name: string) {
        return new SpriteProperty(name, this.type, this.hidden, this.value);
    }

    setType(type: SpritePropertyType) {
        return new SpriteProperty(this.name, type, this.hidden, this.value);
    }

    setValue(value: any) {
        return new SpriteProperty(this.name, this.type, this.hidden, value);
    }
    
    setHidden(hidden: boolean) {
        return new SpriteProperty(this.name, this.type, hidden, this.value);
    }

    serialize(): SpritePropertyData {
        return {
            name: this.name,
            type: this.type,
            value: this.value,
        }
    }

    static deserialize(data: SpritePropertyData): SpriteProperty {
        let type = SpritePropertyTypes.find(x => x == data.type);

        if (!type) {
            type = "Unknown";
        }

        return new SpriteProperty(data.name ?? "unnamed", type, data.value, data.hidden ?? 0);
    }
}

export class SpriteProperties {
    constructor(
        public readonly properties: SpriteProperty[]) {
    }

    getProperty(name: string): SpriteProperty | undefined {
        return this.properties.find(x => x.name === name);
    }

    addProperty(property: SpriteProperty) {
        return new SpriteProperties(ReadOnlyArray.add(this.properties, property));
    }
    updateProperty(previous: SpriteProperty, current: SpriteProperty) {
        return new SpriteProperties(ReadOnlyArray.replace(this.properties, previous, current));
    }
    removeProperty(property: SpriteProperty) {
        return new SpriteProperties(ReadOnlyArray.remove(this.properties, property));
    }

    serialize(): SpritePropertyData[] {
        return this.properties.map(x => x.serialize());
    }

    static deserialize(properties: SpritePropertyData[]) {
        return new SpriteProperties(properties.map(x => SpriteProperty.deserialize(x)));
    }
}