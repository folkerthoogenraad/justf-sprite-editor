import { Sprite, SpriteData } from "./Sprite";
import { ReadOnlyArray } from "./utils/ReadOnlyArray";

export interface ResourcesData {
    sprites: SpriteData[];
}

export class Resources {
    constructor(public readonly sprites: Sprite[]) { }

    addSprite(sprite: Sprite) {
        return new Resources(ReadOnlyArray.add(this.sprites, sprite));
    }
    
    updateSprite(previous: Sprite, current: Sprite) {
        return new Resources(ReadOnlyArray.replace(this.sprites, previous, current));
    }

    removeSprite(sprite: Sprite) {
        return new Resources(ReadOnlyArray.remove(this.sprites, sprite));
    }
    
    getSpriteById(id: string) {
        return this.sprites.find(x => x.id === id);
    }

    serialize(): ResourcesData {
        return {
            sprites: this.sprites.map(x => x.serialize())
        };
    }
    static deserialize(data: ResourcesData) {
        return new Resources(data.sprites.map(x => Sprite.deserialize(x)));
    }
}