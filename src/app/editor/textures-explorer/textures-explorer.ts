import { Component, inject } from '@angular/core';
import { ProjectFolderService } from '../project-folder-service';
import { Button } from "../../components/button/button";
import { EditorStateService } from '../editor-state-service';
import { Icon } from "../../components/icon/icon";

@Component({
  selector: 'app-textures-explorer',
  imports: [Button, Icon],
  templateUrl: './textures-explorer.html',
  styleUrl: './textures-explorer.scss',
})
export class TexturesExplorer {
  folder = inject(ProjectFolderService);
  state = inject(EditorStateService);
}
