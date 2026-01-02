import { booleanAttribute, Component, input, signal } from '@angular/core';
import { TexturesExplorer } from "../textures-explorer/textures-explorer";
import { SpritesExplorer } from "../sprites-explorer/sprites-explorer";

@Component({
  selector: 'app-sidebar',
  imports: [TexturesExplorer, SpritesExplorer],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  selectedItem = signal(""); // Move this to editor state probably? :)

  right = input(false, {transform: booleanAttribute});
  left = input(false, {transform: booleanAttribute});
}
