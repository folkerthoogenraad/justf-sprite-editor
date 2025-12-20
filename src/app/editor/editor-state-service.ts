import { Injectable, signal } from '@angular/core';
import { IOSprite } from '../../ts/IOSprite';

interface TextureState {
  file: File;
  url: string;

  image: HTMLImageElement;
}

@Injectable({
  providedIn: 'root',
})
export class EditorStateService {
  loading = signal(false);
  
  texture = signal<TextureState | undefined>(undefined);
  sprites = signal<IOSprite[]>([new IOSprite("sprite.test", 0, 0, 16, 16), new IOSprite("sprite.test.2", 32, 0, 16, 16)]);

  selectedSpriteIds = signal<Set<string>>(new Set<string>());

  isSelected(sprite: IOSprite) {
    return this.selectedSpriteIds().has(sprite.id);
  }
  select(sprite: IOSprite) {
    let ids = this.selectedSpriteIds();

    ids.clear();
    ids.add(sprite.id);

    this.selectedSpriteIds.set(ids);
  }

  async openFile() {
    if(this.loading()) return;

    this.loading.set(true);

    try {
      await this.tryLoadFile();
    }
    catch(e) {
      console.dir(e);
    }

    this.loading.set(false);
  }

  private async tryLoadFile() {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Images",
          accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    });
    
    let file = await fileHandle.getFile();

    await this.setTextureFile(file);
  }

  private async setTextureFile(file: File) {
    const current = this.texture();

    if(current != undefined) {
      URL.revokeObjectURL(current.url);
    }

    let url = URL.createObjectURL(file);

    let image = await this.loadImage(url);

    this.texture.set({
      file: file,
      url: url,
      image
    });
  }

  private loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let image = new Image();

      image.onload = () => resolve(image);
      image.onerror = () => reject();
      
      image.src = src;
    });
  }
}
