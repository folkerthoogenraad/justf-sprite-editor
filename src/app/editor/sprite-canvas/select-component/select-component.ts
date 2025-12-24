import { Component, inject } from '@angular/core';
import { EditorStateService } from '../../editor-state-service';
import { EditorSelectionService } from '../../editor-selection-service';

@Component({
  selector: 'app-select-component',
  imports: [],
  templateUrl: './select-component.html',
  styleUrl: './select-component.scss',
})
export class SelectComponent {
  selection = inject(EditorSelectionService);

  onPointerUp() {
    this.selection.deselectAll();
  }
}
