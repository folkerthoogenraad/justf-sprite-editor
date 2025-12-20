import { Component, computed, inject, input, output } from '@angular/core';
import { IOSprite } from '../../../ts/IOSprite';
import { SpriteViewService } from '../sprite-view-service';
import { EditorStateService } from '../editor-state-service';

@Component({
  selector: 'app-sprite-view-sprite-outline-component',
  imports: [],
  templateUrl: './sprite-view-sprite-outline-component.html',
  styleUrl: './sprite-view-sprite-outline-component.scss',
})
export class SpriteViewSpriteOutlineComponent {
  viewport = inject(SpriteViewService);

  selected = input(false);
  
  select = output();

  sprite = input.required<IOSprite>();

  x = computed(() => this.sprite().x);
  y = computed(() => this.sprite().y);

  width = computed(() => this.sprite().width);
  height = computed(() => this.sprite().height);

  styleLeft = this.viewport.computedLeft(this.x);
  styleTop = this.viewport.computedTop(this.y);
  styleWidth = this.viewport.computedSize(this.width);
  styleHeight = this.viewport.computedSize(this.height);
}
