import { Component, inject } from '@angular/core';
import { Button } from "../../components/button/button";
import { EditorStateService, EditorTool } from '../editor-state-service';
import { ProjectFolderService } from '../project-folder-service';
import { Icon } from "../../components/icon/icon";
import { ToggleButton } from "../../components/toggle-button/toggle-button";

@Component({
  selector: 'app-navbar',
  imports: [Button, Icon, ToggleButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  folder = inject(ProjectFolderService);
  state = inject(EditorStateService);

  isSelectTool() { return this.state.tool() === EditorTool.Select; }
  isSpriteTool() { return this.state.tool() === EditorTool.CreateSprite; }
  isFrameTool() { return this.state.tool() === EditorTool.CreateFrame; }

  setSelectTool() {this.state.tool.set(EditorTool.Select); }
  setSpriteTool() {this.state.tool.set(EditorTool.CreateSprite); }
  setFrameTool() {this.state.tool.set(EditorTool.CreateFrame); }
}
