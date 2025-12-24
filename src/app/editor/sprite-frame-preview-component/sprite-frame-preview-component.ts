import { Component, computed, effect, ElementRef, HostBinding, inject, input, signal, untracked, viewChild } from '@angular/core';
import { Sprite } from '../../../ts/Sprite';
import { EditorStateService } from '../editor-state-service';

@Component({
  selector: 'app-sprite-frame-preview-component',
  imports: [],
  templateUrl: './sprite-frame-preview-component.html',
  styleUrl: './sprite-frame-preview-component.scss',
})
export class SpritePreviewComponent {
  container = viewChild<ElementRef<HTMLElement>>("container");
  state = inject(EditorStateService);

  sprite = input.required<Sprite>();
  frameIndex = input.required<number>();

  rotation = input<number>(0);

  frame = computed(() => this.sprite().frames[this.frameIndex()]);

  aspectRatio = computed(() => this.frame().width / this.frame().height);

  textureUrl = computed(() => `url("${this.state.texture()?.url}")`);
  textureWidth = computed(() => this.state.texture()?.image.width ?? 1);
  textureHeight = computed(() => this.state.texture()?.image.height ?? 1);

  @HostBinding("style") get style() {
    return { "aspect-ratio": this.aspectRatio() }
  }
}
