import { ReadOnlyArray } from "./utils/ReadOnlyArray";

export interface SpriteData {
    id: string;
    texture: string;
    frames: SpriteFrameData[];
}

export class Sprite {
    constructor(
        public readonly id : string,
        public readonly texture : string,
        public readonly frames: SpriteFrame[]
    ) { }

    setId(id: string) {
        return new Sprite(id, this.texture, this.frames);
    }
    
    setTextureId(textureId: string){
        return new Sprite(this.id, textureId, this.frames);
    }

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
        return new Sprite(this.id, this.texture, frames);
    }

    serialize(): SpriteData {
        return {
            id: this.id,
            texture: this.texture,
            frames: this.frames.map(x => x.serialize())
        };
    }

    static deserialize(data: SpriteData) {
        return new Sprite(data.id, data.texture, data.frames.map(x => SpriteFrame.deserialize(x)));
    }
}

export interface SpriteFrameData {
    x: number;
    y: number;
    width: number;
    height: number;
    originX: number;
    originY: number;
}

export class SpriteFrame {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly originX: number;
    readonly originY: number;

    constructor(x: number, y: number, width: number, height: number, originX: number, originY: number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.originX = originX;
        this.originY = originY;
    }

    setPosition(x: number, y: number) {
        return new SpriteFrame(x, y, this.width, this.height, this.originX, this.originY);
    }
    setSize(width: number, height: number) {
        return new SpriteFrame(this.x, this.y, width, height, this.originX, this.originY);
    }
    setOrigin(originX: number, originY: number) {
        return new SpriteFrame(this.x, this.y, this.width, this.height, originX, originY);
    }

    serialize(): SpriteFrameData {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            originX: this.originX,
            originY: this.originY,
        };
    }
    static deserialize(data: SpriteFrameData) {
        return new SpriteFrame(data.x, data.y, data.width, data.height, data.originX, data.originY);
    }
}