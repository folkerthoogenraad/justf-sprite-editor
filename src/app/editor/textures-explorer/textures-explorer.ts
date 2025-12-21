import { Component, inject } from '@angular/core';
import { ProjectFolderService } from '../project-folder-service';
import { Button } from "../../components/button/button";
import { EditorStateService } from '../editor-state-service';

@Component({
  selector: 'app-textures-explorer',
  imports: [Button],
  templateUrl: './textures-explorer.html',
  styleUrl: './textures-explorer.scss',
})
export class TexturesExplorer {
  folder = inject(ProjectFolderService);
  state = inject(EditorStateService);
}
