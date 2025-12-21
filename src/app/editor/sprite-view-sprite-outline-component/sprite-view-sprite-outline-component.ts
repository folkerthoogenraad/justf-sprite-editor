import { Component, computed, effect, ElementRef, inject, input, output, provideEnvironmentInitializer, signal, untracked, viewChild } from '@angular/core';
import { Sprite } from '../../../ts/Sprite';
import { SpriteViewService } from '../sprite-view-service';
import { SpriteViewResizeHandle } from "../canvas/resize-handle-component/resize-handle-component";
import { Point } from '../../../ts/utils/Point';
import { ChangableText } from "../../components/changable-text/changable-text";

interface Outline {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

@Component({
  selector: 'app-sprite-view-sprite-outline-component',
  imports: [SpriteViewResizeHandle, ChangableText],
  templateUrl: './sprite-view-sprite-outline-component.html',
  styleUrl: './sprite-view-sprite-outline-component.scss',
})
export class SpriteViewSpriteOutlineComponent {
  outlineElement = viewChild<ElementRef<HTMLElement>>("outlineElement");

  viewport = inject(SpriteViewService);

  selected = input(false);
  
  select = output();

  sprite = input.required<Sprite>();
  spriteChange = output<Sprite>();

  frame = computed(() => {
    const sprite = this.sprite();

    if(!sprite) return undefined;
    if(sprite.frames.length === 0) return undefined;

    return sprite.frames[0];
  });

  outlineFrame = signal<Outline>({ top: 0, left: 0, bottom: 0, right: 0 });
  outlinePreview = signal<Outline | undefined>(undefined);

  outline = computed(() => {
    const preview = this.outlinePreview();
    const frame = this.outlineFrame();

    if(preview) return preview;

    return frame;
  });

  constructor() {
    effect(() => {
      const frame = this.frame();

      if(!frame) return;

      untracked(() => {
        this.outlineFrame.set({
          left: frame.x,
          top: frame.y,
          right: frame.x + frame.width,
          bottom: frame.y + frame.height,
        });
      });

    });
  }

  x = computed(() => this.outline().left);
  y = computed(() => this.outline().top);

  width = computed(() => this.outline().right - this.outline().left);
  height = computed(() => this.outline().bottom - this.outline().top);

  styleLeft = this.viewport.computedLeft(this.x);
  styleTop = this.viewport.computedTop(this.y);
  styleWidth = this.viewport.computedSize(this.width);
  styleHeight = this.viewport.computedSize(this.height);

  // =============================================================== //
  // Moving, dragging and selecting
  // =============================================================== //
  dragPointerId: number = -1;
  dragPointerStart: Point = new Point(0, 0);
  dragPointerEnd: Point = new Point(0, 0);
  
  onPointerDown(evt: PointerEvent) {
    if(this.dragPointerId >= 0) return;
    if(evt.target !== this.outlineElement()?.nativeElement) return;

    this.dragPointerId = evt.pointerId;

    this.select.emit();

    evt.stopImmediatePropagation(); // Prevent others from handling this event.
    evt.preventDefault(); // Prevent weird text selection like things.

    this.dragPointerStart = new Point(evt.clientX, evt.clientY);
    this.dragPointerEnd = new Point(evt.clientX, evt.clientY);

    (evt.target as HTMLElement).setPointerCapture(evt.pointerId);
  }
  onPointerMove(evt: PointerEvent) {
    if(this.dragPointerId != evt.pointerId) return;

    this.dragPointerEnd = new Point(evt.clientX, evt.clientY);

    const offset = Point.direction(this.dragPointerStart, this.dragPointerEnd).scale(1 / this.viewport.zoomLevel()).round();

    const frame = this.outlineFrame();
    
    this.outlinePreview.set({
      left: frame.left + offset.x,
      right: frame.right + offset.x,
      top: frame.top + offset.y,
      bottom: frame.bottom + offset.y
    });
  }
  onPointerUp(evt: PointerEvent) {
    if(this.dragPointerId != evt.pointerId) return;

    this.dragPointerEnd = new Point(evt.clientX, evt.clientY);
    
    const offset = Point.direction(this.dragPointerStart, this.dragPointerEnd).scale(1 / this.viewport.zoomLevel()).round();

    this.dragPointerId = -1;

    this.outlineFrame.update(frame => ({
      left: frame.left + offset.x,
      right: frame.right + offset.x,
      top: frame.top + offset.y,
      bottom: frame.bottom + offset.y
    }));

    this.commit();
  }

  // =============================================================== //
  // Resizing handles etc
  // =============================================================== //
  updatePreviewTopLeft(offset: Point) {
    const frame = this.outlineFrame();
    
    this.outlinePreview.set({
      left: frame.left + offset.x,
      right: frame.right,
      top: frame.top + offset.y,
      bottom: frame.bottom,
    });
  }
  updatePreviewTopRight(offset: Point) {
    const frame = this.outlineFrame();
    
    this.outlinePreview.set({
      left: frame.left,
      right: frame.right + offset.x,
      top: frame.top + offset.y,
      bottom: frame.bottom,
    });
  }
  updatePreviewBottomLeft(offset: Point) {
    const frame = this.outlineFrame();
    
    this.outlinePreview.set({
      left: frame.left + offset.x,
      right: frame.right,
      top: frame.top,
      bottom: frame.bottom + offset.y,
    });
  }
  updatePreviewBottomRight(offset: Point) {
    const frame = this.outlineFrame();
    
    this.outlinePreview.set({
      left: frame.left,
      right: frame.right + offset.x,
      top: frame.top,
      bottom: frame.bottom + offset.y,
    });
  }

  updateTopLeft(offset: Point) {
    this.outlineFrame.update(outline => {
      outline.left += offset.x;
      outline.top += offset.y;
      return {...outline};
    });

    this.commit();
  }
  updateTopRight(offset: Point) {
    this.outlineFrame.update(outline => {
      outline.right += offset.x;
      outline.top += offset.y;
      return {...outline};
    });
    
    this.commit();
  }
  updateBottomLeft(offset: Point) {
    this.outlineFrame.update(outline => {
      outline.left += offset.x;
      outline.bottom += offset.y;
      return {...outline};
    });

    this.commit();
  }
  updateBottomRight(offset: Point) {
    this.outlineFrame.update(outline => {
      outline.right += offset.x;
      outline.bottom += offset.y;
      return {...outline};
    });
    
    this.commit();
  }

  // =============================================================== //
  // Commiting changes to sprite frame
  // =============================================================== //
  commit() {
    this.outlinePreview.set(undefined);

    const sprite = this.sprite();
    const frame = this.frame();
    const outline = this.outlineFrame();

    if(!sprite || !frame) return;

    const x = outline.left;
    const y = outline.top;
    const width = outline.right - outline.left;
    const height = outline.bottom - outline.top;

    const updatedFrame = frame.setPosition(x, y).setSize(width, height);

    const updatedSprite = sprite.updateFrame(frame, updatedFrame);

    this.spriteChange.emit(updatedSprite);
  }

  updateSpriteName(text: string) {
    const sprite = this.sprite();
    
    if(!sprite) return;

    this.spriteChange.emit(sprite.setId(text));
  }
}
