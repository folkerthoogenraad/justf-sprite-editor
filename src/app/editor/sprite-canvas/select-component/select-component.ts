import { Component, inject } from '@angular/core';
import { EditorStateService } from '../../editor-state-service';

@Component({
  selector: 'app-select-component',
  imports: [],
  templateUrl: './select-component.html',
  styleUrl: './select-component.scss',
})
export class SelectComponent {
  state = inject(EditorStateService);

  onPointerUp() {
    this.state.deselectAll();
  }
}
