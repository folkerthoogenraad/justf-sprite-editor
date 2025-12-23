import { Component, inject, input, output } from '@angular/core';
import { ViewportService } from '../../viewport-service';
import { Point } from '../../../../ts/utils/Point';
import { Icon } from "../../../components/icon/icon";

type Direction = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw" | "none";

@Component({
  selector: 'app-resize-handle-component',
  imports: [Icon],
  templateUrl: './resize-handle-component.html',
  styleUrl: './resize-handle-component.scss',
})
export class SpriteViewResizeHandle {
  viewport = inject(ViewportService);

  handleMoved = output<Point>();
  handlePreviewMoved = output<Point>();

  direction = input<Direction>("n");

  draggingPointerStartX: number = 0;
  draggingPointerStartY: number = 0;
  draggingPointerEndX: number = 0;
  draggingPointerEndY: number = 0;
  draggingPointerId: number = -1;

  get dragPixelOffsetX() {
    if(this.draggingPointerId < 0) return 0;

    return this.draggingPointerEndX - this.draggingPointerStartX;
  }
  get dragPixelOffsetY() {
    if(this.draggingPointerId < 0) return 0;

    return this.draggingPointerEndY - this.draggingPointerStartY;
  }
  get dragOffsetX() {
    return Math.round(this.viewport.toViewportScale(this.dragPixelOffsetX));
  }
  get dragOffsetY() {
    return Math.round(this.viewport.toViewportScale(this.dragPixelOffsetY));
  }

  onPointerDown(evt: PointerEvent) {
    if(this.draggingPointerId > 0) return;

    evt.stopImmediatePropagation();
    evt.preventDefault();

    this.draggingPointerId = evt.pointerId;

    this.draggingPointerStartX = evt.clientX;
    this.draggingPointerStartY = evt.clientY;
    
    this.updateEnd(evt);

    (evt.target as HTMLElement).setPointerCapture(evt.pointerId);
  }

  onPointerUp(evt: PointerEvent) {
    if(evt.pointerId !== this.draggingPointerId) {
      return;
    }

    this.updateEnd(evt);
    
    this.handleMoved.emit(new Point(this.dragOffsetX, this.dragOffsetY));

    this.draggingPointerId = -1;

    evt.stopImmediatePropagation();
    evt.preventDefault();
  }

  onPointerMove(evt: PointerEvent) {
    if(evt.pointerId !== this.draggingPointerId) {
      return;
    }

    this.handlePreviewMoved.emit(new Point(this.dragOffsetX, this.dragOffsetY));

    this.updateEnd(evt);

    evt.stopImmediatePropagation();
    evt.preventDefault();
  }

  updateEnd(evt: PointerEvent) {
    this.draggingPointerEndX = evt.clientX;
    this.draggingPointerEndY = evt.clientY;
  }
}
