import { SpriteProperties, SpriteProperty, SpritePropertyData } from "./SpriteProperties";
import { Bounds } from "./utils/Bounds";
import { ReadOnlyArray } from "./utils/ReadOnlyArray";

export interface SpriteData {
    id?: string;
    texture?: string;
    frameRate?: number;
    frames?: SpriteFrameData[];
    properties?: SpritePropertyData[];
}

export class Sprite {
    private bounds: Bounds | undefined = undefined;

    constructor(
        public readonly id: string,
        public readonly texture: string,
        public readonly frameRate: number,
        public readonly frames: SpriteFrame[],
        public readonly properties: SpriteProperties,
    ) { }

    setId(id: string) {
        return new Sprite(id, this.texture, this.frameRate, this.frames, this.properties);
    }

    setTextureId(textureId: string) {
        return new Sprite(this.id, textureId, this.frameRate, this.frames, this.properties);
    }

    // =================================================================== //
    // Frames
    // =================================================================== //
    addFrame(frame: SpriteFrame) {
        return this.setFrames(ReadOnlyArray.add(this.frames, frame));
    }
    updateFrame(old: SpriteFrame, current: SpriteFrame) {
        return this.setFrames(ReadOnlyArray.replace(this.frames, old, current));
    }
    removeFrame(frame: SpriteFrame) {
        return this.setFrames(ReadOnlyArray.remove(this.frames, frame));
    }
    setFrames(frames: SpriteFrame[]) {
        return new Sprite(this.id, this.texture, this.frameRate, frames, this.properties);
    }

    // =================================================================== //
    // Properties (forwarding)
    // =================================================================== //
    getProperty(name: string): SpriteProperty | undefined {
        return this.properties.getProperty(name);
    }

    addProperty(property: SpriteProperty) {
        return this.setProperties(this.properties.addProperty(property));
    }
    updateProperty(previous: SpriteProperty, current: SpriteProperty) {
        return this.setProperties(this.properties.updateProperty(previous, current));
    }
    removeProperty(property: SpriteProperty) {
        return this.setProperties(this.properties.removeProperty(property));
    }

    setProperties(properties: SpriteProperties) {
        return new Sprite(this.id, this.texture, this.frameRate, this.frames, properties);
    }

    // =================================================================== //
    // Serialization
    // =================================================================== //
    serialize(): SpriteData {
        return {
            id: this.id,
            texture: this.texture,
            frameRate: this.frameRate,
            frames: this.frames?.map(x => x.serialize()),
            properties: this.properties.serialize(),
        };
    }

    getBounds(): Bounds {
        if(this.bounds) return this.bounds;

        const left = this.frames.reduce((minimum, frame) => Math.min(minimum, frame.x), Infinity);
        const right = this.frames.reduce((maximum, frame) => Math.max(maximum, frame.x + frame.width), -Infinity);

        const top = this.frames.reduce((minimum, frame) => Math.min(minimum, frame.y), Infinity);
        const bottom = this.frames.reduce((maximum, frame) => Math.max(maximum, frame.y + frame.height), -Infinity);

        this.bounds = new Bounds(left, right, top, bottom);

        return this.bounds;
    }

    static deserialize(data: SpriteData) {
        return new Sprite(
            data.id ?? "missing", 
            data.texture ?? "missing", 
            data.frameRate ?? 8,
            data.frames?.map(x => SpriteFrame.deserialize(x)) ?? [],
            SpriteProperties.deserialize(data.properties ?? [])
        );
    }
}

export interface SpriteFrameData {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    originX?: number;
    originY?: number;
    properties?: SpritePropertyData[];
}

export class SpriteFrame {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly originX: number;
    readonly originY: number;
    readonly properties: SpriteProperties;

    constructor(x: number, y: number, width: number, height: number, originX: number, originY: number, properties: SpriteProperties) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.originX = originX;
        this.originY = originY;
        this.properties = properties;
    }

    // =================================================================== //
    // Basics
    // =================================================================== //
    setPosition(x: number, y: number) {
        return new SpriteFrame(x, y, this.width, this.height, this.originX, this.originY, this.properties);
    }
    setSize(width: number, height: number) {
        return new SpriteFrame(this.x, this.y, width, height, this.originX, this.originY, this.properties);
    }
    setOrigin(originX: number, originY: number) {
        return new SpriteFrame(this.x, this.y, this.width, this.height, originX, originY, this.properties);
    }

    // =================================================================== //
    // Properties (forwarding)
    // =================================================================== //
    getProperty(name: string): SpriteProperty | undefined {
        return this.properties.getProperty(name);
    }

    addProperty(property: SpriteProperty) {
        return this.setProperties(this.properties.addProperty(property));
    }
    updateProperty(previous: SpriteProperty, current: SpriteProperty) {
        return this.setProperties(this.properties.updateProperty(previous, current));
    }
    removeProperty(property: SpriteProperty) {
        return this.setProperties(this.properties.removeProperty(property));
    }

    setProperties(properties: SpriteProperties) {
        return new SpriteFrame(this.x, this.y, this.width, this.height, this.originX, this.originY, properties);
    }

    // =================================================================== //
    // Serialization
    // =================================================================== //
    serialize(): SpriteFrameData {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            originX: this.originX,
            originY: this.originY,
            properties: this.properties.serialize(),
        };
    }
    static deserialize(data: SpriteFrameData) {
        return new SpriteFrame(
            data.x ?? 0, 
            data.y ?? 0, 
            data.width ?? 0, 
            data.height ?? 0,
            data.originX ?? 0, 
            data.originY ?? 0,
            SpriteProperties.deserialize(data.properties ?? [])
        );
    }
}