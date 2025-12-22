import { Component, computed, inject, input, output, signal, VERSION } from '@angular/core';
import { Vector2 } from '../../../../ts/utils/Vector2';
import { ViewportService } from '../../viewport-service';
import { Point } from '../../../../ts/utils/Point';

@Component({
  selector: 'app-move-handle-component',
  imports: [],
  templateUrl: './move-handle-component.html',
  styleUrl: './move-handle-component.scss',
})
export class MoveHandleComponent {
  viewport = inject(ViewportService);

  dragPointerId = -1;
  dragPointerStart = new Vector2(0, 0);
  dragPointerEnd = new Vector2(0, 0);

  x = input(0);
  y = input(0);

  offset = signal<Vector2 | undefined>(undefined);

  styleLeft = computed(() => (this.x() + (this.offset()?.x ?? 0)) * this.viewport.zoomLevel());
  styleTop = computed(() => (this.y() + (this.offset()?.y ?? 0)) * this.viewport.zoomLevel());

  handleMoved = output<Point>();

  onPointerDown(evt: PointerEvent) {
    if(this.dragPointerId > 0) return;

    evt.stopImmediatePropagation();

    this.dragPointerId = evt.pointerId;

    this.dragPointerStart.apply(evt.clientX, evt.clientY);
    
    this.updateEnd(evt);

    (evt.target as HTMLElement).setPointerCapture(evt.pointerId);
  }

  onPointerUp(evt: PointerEvent) {
    if(evt.pointerId !== this.dragPointerId) {
      return;
    }

    this.updateEnd(evt);
    
    this.dragPointerId = -1;

    this.handleMoved.emit(new Point(this.offset()?.x ?? 0, this.offset()?.y ?? 0));
    
    this.offset.set(undefined);

    evt.stopImmediatePropagation();
  }

  onPointerMove(evt: PointerEvent) {
    if(evt.pointerId !== this.dragPointerId) {
      return;
    }

    this.updateEnd(evt);
  }

  updateEnd(evt: PointerEvent){
    this.dragPointerEnd.apply(evt.clientX, evt.clientY);

    let scale = 1 / this.viewport.zoomLevel();

    let start = (this.dragPointerStart.clone().scale(scale));
    let end = (this.dragPointerEnd.clone().scale(scale));

    let offset = this.round(end.clone().sub(start));

    this.offset.set(offset);
  }

  private round(v: Vector2) {
    v.x = Math.round(v.x * 2) / 2;
    v.y = Math.round(v.y * 2) / 2;

    return v;
  }
}
