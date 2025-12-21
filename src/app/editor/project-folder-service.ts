import { effect, Injectable, signal, untracked } from '@angular/core';
import { ProjectFolder } from '../../ts/project/ProjectFolder';

@Injectable({
  providedIn: 'root',
})
export class ProjectFolderService {
  loading = signal(false);
  folder = signal<ProjectFolder | undefined>(undefined);
  textures = signal<string[]>([]);

  constructor() {
    effect(() => {
      const folder = this.folder();

      if(folder != undefined) {
        untracked(() => {
          this.reloadTextureList();
        });

        untracked(() => {
          ProjectFolder.storeProjectFolder(folder);
        });
      }
    });

    this.restore();
  }

  async getFile(file: string): Promise<File | undefined> {
    if(this.loading()) return;

    const folder = this.folder();

    if(!folder) return;

    let handle = await folder.getFileHandle(file);

    return await handle.getFile();
  }
  
  async openFolder() {
    if(this.loading()) return;

    let folder = await ProjectFolder.showPicker();

    this.folder.set(folder);
  }

  async restore() {
    let folder = await ProjectFolder.getStoredProjectFolder();

    this.folder.set(folder);
  }

  async reloadTextureList() {
    if(this.loading()) return;

    const folder = this.folder();

    if(!folder) return;

    this.loading.set(true);

    let textures: string[] = [];

    try {
      for await (const [key, value] of await folder.getFiles()) {
        if(key.endsWith(".png") && value.kind == "file") {
          textures.push(key); 
        }
      }
    }
    catch(e) {
      console.dir(e);
    }

    this.textures.set(textures);

    this.loading.set(false);
  }
}
