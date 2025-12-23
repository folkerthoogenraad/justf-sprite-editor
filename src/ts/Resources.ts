import { Sprite, SpriteData } from "./Sprite";
import { ReadOnlyArray } from "./utils/ReadOnlyArray";

const regex = new RegExp(/(?<name>[\w_.]*\.)(?<digits>\d+)/);

export interface ResourcesData {
    sprites: SpriteData[];
}

export class Resources {
    private spriteIdCache : Map<string, Sprite> | undefined = undefined;

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
        const cache = this.getCache();

        return cache.get(id);
    }

    private getCache() {
        if(this.spriteIdCache !== undefined) {
            return this.spriteIdCache;
        }

        // Create the cache!
        let cache = new Map<string, Sprite>();

        this.sprites.forEach(sprite => cache.set(sprite.id, sprite));

        this.spriteIdCache = cache;

        return cache;
    }

    serialize(): ResourcesData {
        return {
            sprites: this.sprites.map(x => x.serialize())
        };
    }

    static deserialize(data: ResourcesData) {
        return new Resources(data.sprites.map(x => Sprite.deserialize(x)));
    }

    getFirstAvailableId(target: string) {
        // This is super duper not efficient but also, I don't really care :)
        const cache = this.getCache();

        if(!cache.has(target)) {
            return target;
        }

        let name = target + ".";
        let index = 0;

        // Try and get the name from the existing thing
        {
            let match = target.match(regex);
    
            console.dir(match);

            if(match?.groups) {
                name = match?.groups["name"];
                index = parseInt(match?.groups["digits"]);
            }
        }

        let newName = name + index;

        while(cache.has(newName)) {
            index += 1;
            newName = name + index;
        }

        return newName;
    }
}